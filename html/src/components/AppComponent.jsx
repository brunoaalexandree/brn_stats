import React from "react";
import { useState } from "react";
import styles from "./AppComponent.module.css";
import { Check, Dot, X } from "lucide-react";

const AppComponent = () => {
  const [visible, setVisible] = useState(false);
  const [playerInfo, setPlayerInfo] = useState({});
  const [pedsInfo, setPedsInfo] = useState([]);

  function enviarDadosParaoJogo(path, dados) {
    let config = {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(dados),
    };
    fetch(`https://${GetParentResourceName()}/${path}`, config);
  }

  window.addEventListener("message", (event) => {
    setPlayerInfo(event.data.playerInfo)
    setPedsInfo(event.data.pedsInfo);
    
    if (event.data.type === "open") {
      setVisible(true);
    }

    if (event.data.type === "fecharTela") {
      setVisible(false);
    }
  });

  if (visible) {
    return (
      <div className="w-full h-screen flex items-center justify-between">
        <div></div>
        <div className="w-full max-w-[960px] flex flex-col  bg-black/60">
          {/* ATTACK STATS */}
          <table class="w-full table-auto ">
            <thead>
              <tr className="">
                <th className="w-[70px]"></th>
                <th className="w-[280px] text-white font-medium text-[12px] py-[8px]">
                  NAME
                </th>
                <th className="w-[236px] text-white font-medium text-[12px] py-[8px]">
                  KDA
                </th>
                <th className="text-white font-medium text-[12px] py-[8px]">
                  LOADOUT
                </th>
                <th className="text-white font-medium text-[12px] py-[8px]">
                  CREDS
                </th>
                <th className="text-white font-medium text-[12px] py-[8px]">
                  PING
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-green-400/50">
                <td>
                  <div className="">
                    <div className="w-[50px] h-[50px] bg-black rounded-full"></div>
                  </div>
                </td>
                <td className="w-[280px] text-center text-white text-[14px] font-medium">
                  MidnightWolf
                </td>
                <td className="w-[236px] text-center text-white text-[14px] bg-green-400/30">
                  {playerInfo.totalKills} / 0 / 0
                </td>
                <td className="text-center text-white text-[14px]">{playerInfo.armaUsada}</td>
                <td className="text-center text-white text-[14px] bg-green-400/30">
                  5,800
                </td>
                <td className="text-center text-white text-[14px]">16</td>
              </tr>
            </tbody>
          </table>

          {/* DIVISORS STATS */}
          <div className="w-full h-[80px] mt-4 flex flex-col justify-center">
            <div className="w-full h-1/2 flex items-center">
              <span className="text-white text-[14px] font-medium ml-2">
                ATK
              </span>
              <span className="ml-6 text-lg font-bold text-green-400">6</span>
              <div className="w-full ml-7 mr-10 flex justify-between">
                <Check className="text-green-400" />
                <Check className="text-green-400" />
                <Check className="text-green-400" />
                <Dot className="text-white" />
                <Dot className="text-white" />
                <Check className="text-green-400" />
                <Dot className="text-white" />
                <Check className="text-green-400" />
                <Dot className="text-white" />
                <Check className="text-green-400" />
              </div>
            </div>
            <div className="w-full h-1/2 flex items-center">
              <span className="text-white text-[14px] font-medium ml-2">
                DEF
              </span>
              <span className="ml-6 text-lg font-bold text-red-400">4</span>
              <div className="w-full ml-7 mr-10 flex justify-between">
                <Dot className="text-white" />
                <Dot className="text-white" />
                <Dot className="text-white" />
                <X className="text-red-400" />
                <X className="text-red-400" />
                <Dot className="text-white" />
                <X className="text-red-400" />
                <Dot className="text-white" />
                <X className="text-red-400" />
                <Dot className="text-white" />
              </div>
            </div>
          </div>

          {/* DEFENDERS STATS */}
          <table class="w-full table-auto ">
            <thead>
              <tr className="">
                <th className="w-[70px]"></th>
                <th className="w-[280px] text-white font-medium text-[12px] py-[8px]">Ped ID</th>
                <th className="w-[236px] text-white font-medium text-[12px] py-[8px]">K/D/A</th>
                <th className="text-white font-medium text-[12px] py-[8px]">Head Damage</th>
                <th className="text-white font-medium text-[12px] py-[8px]">Left Arm Damage</th>
                <th className="text-white font-medium text-[12px] py-[8px]">Right Arm Damage</th>
                <th className="text-white font-medium text-[12px] py-[8px]">Chest Damage</th>
                <th className="text-white font-medium text-[12px] py-[8px]">Left Leg Damage</th>
                <th className="text-white font-medium text-[12px] py-[8px]">Right Leg Damage</th>
              </tr>
            </thead>
            <tbody>
              {pedsInfo.map((ped) => (
                <tr className="bg-red-400/50" key={ped.id}>
                  <td>
                    <div className="">
                      <div className="w-[50px] h-[50px] bg-black rounded-full"></div>
                    </div>
                  </td>
                  <td className="w-[280px] text-center text-white text-[14px] font-medium">
                    {ped.id}
                  </td>
                  <td className="w-[236px] text-center text-white text-[14px] bg-red-400/30">
                    0 / {ped.kills} / 0
                  </td>
                  <td className="text-center text-white text-[14px]">{ped.bodyDamage.head}</td>
                  <td className="text-center text-white text-[14px] bg-red-400/30">{ped.bodyDamage.leftArm}</td>
                  <td className="text-center text-white text-[14px]">{ped.bodyDamage.rightArm}</td>
                  <td className="text-center text-white text-[14px] bg-red-400/30">{ped.bodyDamage.chest}</td>
                  <td className="text-center text-white text-[14px]">{ped.bodyDamage.leftLeg}</td>
                  <td className="text-center text-white text-[14px] bg-red-400/30">{ped.bodyDamage.rightLeg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h1>stats</h1>
        </div>
      </div>
    );
  }
};

export default AppComponent;
