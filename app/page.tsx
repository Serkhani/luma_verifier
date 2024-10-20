"use client";
import { useState } from "react";
import styles from "./page.module.css";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import JSONPretty from "react-json-pretty";
import { ethers } from "ethers";
import AttestationABI from "./AttestationABI.json";
import { Res } from "./lib/types";
import verifyEvmBasedResult from "./verifyEvmBasedResult";
const FormGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-8 grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto my-12 bg-gray-900 p-6 rounded-lg shadow-lg">
    {children}
  </div>
);

const FormContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center w-full  space-y-6 p-4 bg-gray-900">{children}</div>
);


const FormItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col justify-start items-start w-full mb-6 space-y-2">
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-left text-base font-medium text-gray-300 mb-1">{children}</label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="block bg-gray-800 border border-gray-700 rounded-lg h-10 leading-10 w-full px-4 outline-none text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
);

const Button = ({ children, disabled, onClick }: { children: React.ReactNode, disabled?: boolean, onClick?: () => void }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative block min-w-[120px] h-10 leading-10 px-6 text-center border-none rounded-lg text-sm font-semibold bg-green-600 text-white transition-colors duration-300 ${
      disabled ? "cursor-not-allowed bg-gray-500" : "cursor-pointer hover:bg-green-500 active:bg-green-700"
    }`}
  >
    {children}
  </button>
);

const RightContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="col-span-1 bg-gray-800 rounded-lg p-6 shadow-lg">{children}</div>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl text-white text-center font-semibold mb-8">{children}</h2>
);
declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const [appid1, setAppid1] = useState<string>(
    // "457d0c43-53ea-4d67-8d27-d89174f51bb7"
    // "ed8aa728-ae64-418f-8f7f-447c416033f6"
    "d8b29079-2fc2-4b3a-8ef0-17a9fd6fab06"
    // "fc110457-b954-482a-b73d-710316120d2c"
  );
  const [value1, setValue1] = useState<string>(
    "1011731a959546e3912de18564bc7abb"
    // "a9b7a62043a2485cac24ebfe0f03df9a"
    // "ec0661b638474c16b59621a44951d14a"
  );
  const [result, setResult] = useState<any>();
  const [attestAtationTx, setAttestAtationTx] = useState<string>();

  const start = async (schemaId: string, appid: string) => {
    try {
      const connector = new TransgateConnect(appid);
      const isAvailable = await connector.isTransgateAvailable();
      if (!isAvailable) {
        return alert("Please install zkPass TransGate");
      }
      if (window.ethereum == null) {
        return alert("MetaMask not installed");
      }
      if (Number(window.ethereum.chainId) !== 2810) {
        return alert("Please switch to Morph network");
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      const contractAddress = "0x79208010a972D0C0a978a9073bd0dcb659152072";
      const contract = new ethers.Contract(
        contractAddress,
        AttestationABI,
        signer
      );



      const res = await connector.launch(schemaId, account) as Res ;
      setResult(res);

      const isVerified = verifyEvmBasedResult(res, schemaId)

      if (!isVerified) {
        return alert("Invalid result");
      }

      const taskId = ethers.hexlify(ethers.toUtf8Bytes(res.taskId));
      schemaId = ethers.hexlify(ethers.toUtf8Bytes(schemaId));

      const chainParams = {
        taskId,
        schemaId,
        uHash: res.uHash,
        recipient: account,
        publicFieldsHash: res.publicFieldsHash,
        validator: res.validatorAddress,
        allocatorSignature: res.allocatorSignature,
        validatorSignature: res.validatorSignature,
      };

      const t = await contract.attest(chainParams);
      setAttestAtationTx(t.hash);
      alert("Transaction sent successfully!");
    } catch (err) {
      alert(JSON.stringify(err));
      console.log("error", err);
    }
  };

  return (
    <main className={styles.main}>
      <Title>Proof of Participation: iExchange Testing and ZK Workshop</Title>
      <FormGrid>
        <FormContainer>
          <FormItem>
            <Label>Appid: </Label>
            <Input
              value={appid1}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAppid1(e.target.value?.trim())
              }
            />
          </FormItem>
          <FormItem>
            <Label>SchemaId: </Label>
            <Input
              value={value1}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue1(e.target.value?.trim())
              }
            />
          </FormItem>
          <FormItem>
            <RightContainer>
              <Button onClick={() => start(value1, appid1)}>Run</Button>
            </RightContainer>
          </FormItem>
          <FormItem>
            {attestAtationTx && (
              <>
                <Label>AttestationTx: </Label>
                <a href={"https://explorer-holesky.morphl2.io/tx/" + attestAtationTx} target="_blank" rel="noopener noreferrer">
                  {attestAtationTx}
                </a>
              </>
            )}
            {result && (
              <>
                <Label>Result: </Label>
                <JSONPretty
                  themeClassName="custom-json-pretty"
                  id="json-pretty"
                  data={result}
                ></JSONPretty>
              </>
            )}
          </FormItem>
        </FormContainer>
      </FormGrid>
    </main>
  );
}
