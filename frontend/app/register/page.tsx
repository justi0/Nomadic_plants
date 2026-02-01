"use client";

import { Navbar } from "@/components/Navbar";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/config";
import { useState } from "react";
import clsx from "clsx";

const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_PLANT_REGISTRY_ADDRESS as `0x${string}`;

export default function Register() {
    const account = useActiveAccount();
    const { mutateAsync: sendTransaction, isPending } = useSendTransaction();
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [species, setSpecies] = useState("");
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!account) return;
        if (!REGISTRY_ADDRESS) {
            alert("Contract address not configured");
            return;
        }
        if (!photo) {
            alert("Please upload a photo of your plant");
            return;
        }

        try {
            setIsUploading(true);

            // Upload to Pinata
            const formData = new FormData();
            formData.append("file", photo);

            const uploadRes = await fetch("/api/files", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");

            const { cid } = await uploadRes.json();

            if (!cid) throw new Error("No CID returned from upload");

            // Mint NFT with real CID
            const contract = getContract({
                client,
                chain: sepolia,
                address: REGISTRY_ADDRESS,
            });

            const transaction = prepareContractCall({
                contract,
                method: "function registerPlant(string species, string name, string photoIPFS)",
                params: [species, name, cid],
            });

            await sendTransaction(transaction);
            setIsSuccess(true);
            setSpecies("");
            setName("");
            setPhoto(null);
        } catch (err) {
            console.error(err);
            setError(err as Error);
            alert("Error registering plant: " + (err as Error).message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background with overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2670&auto=format&fit=crop"
                        alt="Plant Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-green-950/60 backdrop-blur-sm"></div>
                </div>

                <div className="relative z-10 max-w-md w-full space-y-8 bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20">
                    <div className="text-center">
                        <span className="text-4xl mb-2 block">🌿</span>
                        <h2 className="text-3xl font-bold text-green-900 font-serif">Mint PlantSoul</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Create an immutable identity for your plant on the blockchain.
                        </p>
                    </div>

                    {!account ? (
                        <div className="text-center py-6 bg-green-50 rounded-2xl border border-green-100">
                            <p className="text-gray-700 font-medium mb-3">Wallet Required</p>
                            <p className="text-sm text-gray-500 mb-4 px-4">
                                Please connect your wallet using the button in the top right to begin stewardship.
                            </p>
                        </div>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Plant Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-50/50"
                                        placeholder="e.g. Penny"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="species" className="block text-sm font-bold text-gray-700 mb-1">Species</label>
                                    <input
                                        id="species"
                                        name="species"
                                        type="text"
                                        required
                                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-50/50"
                                        placeholder="e.g. Monstera Deliciosa"
                                        value={species}
                                        onChange={(e) => setSpecies(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Plant Photo</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-200 border-dashed rounded-xl cursor-pointer bg-green-50/50 hover:bg-green-50 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-3 text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="text-xs text-green-600"><span className="font-semibold">Click to upload image</span></p>
                                                <p className="text-xs text-gray-400 mt-1">{photo ? photo.name : "Max 5MB"}</p>
                                            </div>
                                            <input type="file" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending || isUploading}
                                className={clsx(
                                    "group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg hover:-translate-y-0.5",
                                    (isPending || isUploading) ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-green-500/30"
                                )}
                            >
                                {isUploading ? "Uploading to IPFS..." : isPending ? "Minting..." : "Mint PlantIdentity"}
                            </button>

                            {isSuccess && (
                                <div className="rounded-xl bg-green-50 p-4 border border-green-200">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800">Registration Successful!</p>
                                            <p className="text-xs text-green-600 mt-1">Your plant is now on-chain. <a href="/my-plants" className="underline font-bold">View Garden</a></p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                                    <p className="text-sm text-red-700">Error: {error.message}</p>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
