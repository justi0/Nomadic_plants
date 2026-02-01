"use client";

import { Navbar } from "@/components/Navbar";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/config";
import { useEffect, useState, use } from "react";
import clsx from "clsx";
import { TransferModal } from "@/components/TransferModal";
import { PhotoProofModal } from "@/components/PhotoProofModal";
import { MemorializeModal } from "@/components/MemorializeModal";

const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_PLANT_REGISTRY_ADDRESS as `0x${string}`;

function timeAgo(timestamp: bigint) {
    if (!timestamp) return "Never";
    const seconds = Math.floor(Date.now() / 1000) - Number(timestamp);
    const days = Math.floor(seconds / (3600 * 24));
    if (days < 0) return "Just now";
    return `${days} days ago`;
}

export default function PlantDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id: idString } = use(params);
    const id = BigInt(idString);
    const account = useActiveAccount();

    const [isTransferOpen, setTransferOpen] = useState(false);
    const [isProofOpen, setProofOpen] = useState(false);
    const [isMemorializeOpen, setMemorializeOpen] = useState(false);

    const contract = getContract({
        client,
        chain: sepolia,
        address: REGISTRY_ADDRESS,
    });

    // Fetch Plant
    const { data: plantData, isLoading } = useReadContract({
        contract,
        method: "function getPlant(uint256 plantId) view returns ((string species, string name, address currentSteward, uint256 lastProofTime, string latestPhotoIPFS, bool isMemorialized, address[] stewards))",
        params: [id],
    });

    const plant = plantData as any; // Quick hack for MVP types

    if (isLoading) return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-green-200 rounded-full mb-4"></div>
                <div className="text-green-600 font-medium">Loading PlantSoul...</div>
            </div>
        </div>
    );

    if (!plant) return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-center p-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Plant Not Found</h1>
                <p className="text-gray-500 mb-6">This PlantSoul does not exist or has returned to the earth.</p>
                <a href="/my-plants" className="text-green-600 hover:text-green-700 font-medium hover:underline">Return to Garden</a>
            </div>
        </div>
    );

    // Destructure safely
    const species = plant.species || plant[0];
    const name = plant.name || plant[1];
    const currentSteward = plant.currentSteward || plant[2];
    const lastProofTime = plant.lastProofTime || plant[3];
    const latestPhoto = plant.latestPhotoIPFS || plant[4];
    const isMemorialized = plant.isMemorialized || plant[5];
    const stewards = plant.stewards || plant[6];

    const isOwner = account?.address === currentSteward;
    const daysSinceProof = Math.floor((Date.now() / 1000 - Number(lastProofTime)) / (3600 * 24));
    const isHealthy = daysSinceProof <= 30;

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Back Link */}
                <div className="mb-6">
                    <a href="/my-plants" className="text-green-600 hover:text-green-800 flex items-center text-sm font-medium">
                        ← Back to My Garden
                    </a>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:flex-shrink-0 md:w-1/2 bg-gray-100 h-96 md:h-auto relative">
                            <img
                                src={latestPhoto
                                    ? (process.env.NEXT_PUBLIC_GATEWAY_URL ? `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${latestPhoto}` : `https://gateway.pinata.cloud/ipfs/${latestPhoto}`)
                                    : "/placeholder-plant.png"
                                }
                                alt={name}
                                className={clsx(
                                    "w-full h-full object-cover",
                                    isMemorialized && "grayscale sepia"
                                )}
                            />
                            {isMemorialized && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white font-serif font-bold text-2xl tracking-widest border-2 border-white px-6 py-3 uppercase bg-black/20 backdrop-blur-sm">
                                        Memorial
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                            <div className="uppercase tracking-widest text-xs text-green-600 font-bold mb-2">{species}</div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-6">{name}</h1>

                            <div className="flex items-center gap-4 mb-8">
                                <span className={clsx(
                                    "px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm",
                                    isHealthy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                )}>
                                    {isHealthy ? "Healthy 🌱" : "Needs Water 💧"}
                                </span>
                                <span className="text-sm text-gray-500 font-medium">
                                    Last care: {timeAgo(lastProofTime)}
                                </span>
                            </div>

                            <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-100">
                                <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">Current Steward</h3>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                                        {currentSteward.slice(2, 4)}
                                    </div>
                                    <p className="font-mono text-sm text-gray-700 truncate">{currentSteward}</p>
                                </div>
                            </div>

                            {isOwner && !isMemorialized ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        {daysSinceProof >= 30 ? (
                                            <button
                                                onClick={() => setProofOpen(true)}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-1"
                                            >
                                                Log Care 📸
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="w-full bg-gray-300 text-gray-500 font-bold py-4 px-4 rounded-xl cursor-not-allowed flex flex-col items-center justify-center leading-tight"
                                            >
                                                <span>Log Care 📸</span>
                                                <span className="text-[10px] uppercase tracking-wide mt-1">
                                                    Available in {30 - daysSinceProof} days
                                                </span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setTransferOpen(true)}
                                            className="w-full bg-white border-2 border-green-100 hover:border-green-300 text-green-800 font-bold py-4 px-4 rounded-xl transition-all hover:-translate-y-1"
                                        >
                                            Transfer 🤝
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setMemorializeOpen(true)}
                                            className="w-full text-xs text-red-400 hover:text-red-600 hover:underline py-2"
                                        >
                                            Report Plant Death (Memorialize)
                                        </button>
                                    </div>
                                </>
                            ) : (
                                !isMemorialized && (
                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center text-gray-500 text-sm">
                                        You are viewing this plant as a guest.
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Lineage */}
                    <div className="px-8 py-10 md:px-12 bg-gray-50/50 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <h3 className="text-xl font-bold text-gray-900 font-serif">Journey Log</h3>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>

                        <div className="relative border-l-2 border-green-200 ml-4 space-y-10">
                            {stewards && (stewards as string[]).map((steward: string, idx: number) => (
                                <div key={idx} className="relative pl-8">
                                    <div className={clsx(
                                        "absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white",
                                        idx === (stewards as any[]).length - 1 ? "bg-green-500" : "bg-green-300"
                                    )}></div>

                                    <div>
                                        <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Steward #{idx + 1}</div>
                                        <div className="font-mono text-sm text-gray-700 bg-white inline-block px-3 py-1 rounded border border-gray-200">
                                            {steward}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main >

            <TransferModal plantId={id} isOpen={isTransferOpen} onClose={() => setTransferOpen(false)} />
            <PhotoProofModal plantId={id} isOpen={isProofOpen} onClose={() => setProofOpen(false)} />
            <MemorializeModal plantId={id} isOpen={isMemorializeOpen} onClose={() => setMemorializeOpen(false)} />
        </div >
    );
}
