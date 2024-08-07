local monitoredPeds = {}
local currentRound = 1
local totalRounds = 2
local maxPeds = 3
local playerInfo = {
    totalKills = 0,
    headShots = 0,
    armaUsada = "",
    roundKills = {},
    pedDamage = {}
}

local gameInProgress = false
local previousHealth = {}

local function identifyMostDamagedPart(damageInfo)
    local maxDamage = 0
    local mostDamagedPart = ""
    for part, damage in pairs(damageInfo) do
        if damage > maxDamage then
            maxDamage = damage
            mostDamagedPart = part
        end
    end
    return mostDamagedPart
end

local function printPlayerInfo()
    print("----- Estatísticas do Jogador -----")
    print("Total de Kills: " .. playerInfo.totalKills)
    print("Headshots: " .. playerInfo.headShots)
    print("Arma Usada: " .. playerInfo.armaUsada)

    for _, pedInfo in ipairs(playerInfo.pedDamage) do
        print("Ped " ..
            pedInfo.id .. " - Parte do Corpo Mais Danificada: " .. identifyMostDamagedPart(pedInfo.bodyDamage))
        for part, damage in pairs(pedInfo.bodyDamage) do
            print(part .. ": " .. damage)
        end
    end

    for round, kills in pairs(playerInfo.roundKills) do
        print("Kills no Round " .. round .. ": " .. kills)
    end
    print("-----------------------------------")
end

local function spawnPeds()
    local pedModel = GetHashKey("a_m_y_hipster_01")
    local playerCoords = GetEntityCoords(PlayerPedId())

    RequestModel(pedModel)
    while not HasModelLoaded(pedModel) do
        Wait(0)
    end

    for i = 1, maxPeds do
        local ped = CreatePed(4, pedModel, playerCoords.x + math.random(-5, 5), playerCoords.y + math.random(-5, 5),
            playerCoords.z, 0.0, true, false)
        SetEntityAsMissionEntity(ped, true, true)
        table.insert(monitoredPeds, ped)
        previousHealth[ped] = GetEntityHealth(ped)
        playerInfo.pedDamage[i] = {
            id = "ped" .. i,
            bodyDamage = {
                head = 0,
                leftArm = 0,
                rightArm = 0,
                chest = 0,
                leftLeg = 0,
                rightLeg = 0
            },
            kills = 0
        }
        print("NPC " .. i .. " adicionado para monitoração")
    end
end

local function startRound()
    gameInProgress = true
    playerInfo.roundKills[currentRound] = 0
    monitoredPeds = {}
    previousHealth = {}
    playerInfo.armaUsada = GetSelectedPedWeapon(PlayerPedId())
    spawnPeds()
    print("Round " .. currentRound .. " iniciado")
end

local function endRound()
    gameInProgress = false
    for _, ped in ipairs(monitoredPeds) do
        if DoesEntityExist(ped) then
            DeleteEntity(ped)
        end
    end
    monitoredPeds = {}

    -- printPlayerInfo()

    SendNUIMessage({
        type = 'open',
        playerInfo = playerInfo,
        pedsInfo = playerInfo.pedDamage
    })
    SetNuiFocus(true, true)

    Wait(5000)

    SendNUIMessage({
        type = 'fecharTela'
    })
    SetNuiFocus(false, false)

    currentRound = currentRound + 1
    if currentRound <= totalRounds then
        -- Teleportar o jogador para uma posição inicial para o próximo round
        local playerPed = PlayerPedId()
        SetEntityCoords(playerPed, 180.03, 200.33, 105.83) -- Coordenadas fornecidas

        startRound()
    else
        print("Jogo finalizado!")
        -- printPlayerInfo()
    end
end

RegisterCommand('pvp', function(source, args, rawCommand)
    if not gameInProgress then
        currentRound = 1
        playerInfo = {
            totalKills = 0,
            headShots = 0,
            armaUsada = "",
            roundKills = {},
            pedDamage = {}
        }
        startRound()
    else
        print("O jogo já está em andamento!")
    end
end, false)

local function getBodyPart(bone)
    if bone == 31086 then
        return "head"
    elseif bone == 18905 or bone == 57005 then
        return "leftArm"
    elseif bone == 28252 or bone == 58866 then
        return "rightArm"
    elseif bone == 11816 or bone == 24816 or bone == 24818 or bone == 24819 or bone == 24820 or bone == 24821 or bone == 24822 or bone == 24823 then
        return "chest"
    elseif bone == 51826 or bone == 58271 then
        return "leftLeg"
    elseif bone == 36864 or bone == 63931 then
        return "rightLeg"
    else
        return "unknown"
    end
end

CreateThread(function()
    while true do
        local sleep = 1000

        if gameInProgress then
            for index, ped in ipairs(monitoredPeds) do
                if DoesEntityExist(ped) then
                    local success, bone = GetPedLastDamageBone(ped)
                    local currentHealth = GetEntityHealth(ped)

                    if IsPedDeadOrDying(ped, true) then
                        playerInfo.totalKills = playerInfo.totalKills + 1
                        playerInfo.roundKills[currentRound] = playerInfo.roundKills[currentRound] + 1
                        playerInfo.pedDamage[index].kills = playerInfo.pedDamage[index].kills + 1
                        print("Kill confirmada! Total de kills: " .. playerInfo.totalKills)
                        DeleteEntity(ped)
                    end

                    if success then
                        local damage = previousHealth[ped] - currentHealth
                        local bodyPart = getBodyPart(bone)
                        local pedDamageInfo = playerInfo.pedDamage[index].bodyDamage

                        if bodyPart ~= "unknown" then
                            pedDamageInfo[bodyPart] = pedDamageInfo[bodyPart] + damage
                            print("Ped " .. index .. " " .. bodyPart:upper() .. ", Damage: " .. damage)
                        else
                            print("Ped " .. index .. " OUTRA PARTE DO CORPO, Damage: " .. damage)
                        end

                        previousHealth[ped] = currentHealth
                        ClearEntityLastDamageEntity(ped)
                    end
                end
            end

            if playerInfo.roundKills[currentRound] >= maxPeds then
                endRound()
            end
        end

        Wait(sleep)
    end
end)
