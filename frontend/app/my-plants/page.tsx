"use client";

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { PlantCard } from "@/components/PlantCard";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/config";
import { useEffect, useState, useMemo } from "react";

const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_PLANT_REGISTRY_ADDRESS as `0x${string}`;

interface PlantData {
    id: bigint;
    species: string;
    name: string;
    currentSteward: string;
    lastProofTime: bigint;
    latestPhotoIPFS: string;
    isMemorialized: boolean;
}

export default function MyPlants() {
    const account = useActiveAccount();
    const [plants, setPlants] = useState<PlantData[]>([]);
    const [loading, setLoading] = useState(false);

    // Thirdweb hook to get balance
    const contract = useMemo(() => getContract({
        client,
        chain: sepolia,
        address: REGISTRY_ADDRESS,
    }), []);

    const { data: balance } = useReadContract({
        contract,
        method: "function balanceOf(address owner) view returns (uint256)",
        params: [account?.address || "0x0000000000000000000000000000000000000000"],
        queryOptions: { enabled: !!account }
    });

    useEffect(() => {
        async function fetchPlants() {
            if (!balance || !account || !REGISTRY_ADDRESS) return;
            setLoading(true);
            try {
                const fetchedPlants: PlantData[] = [];
                const count = Number(balance);

                for (let i = 0; i < count; i++) {
                    try {
                        const tokenId = await readContract({
                            contract,
                            method: "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
                            params: [account.address, BigInt(i)]
                        });

                        const plantDetails = await readContract({
                            contract,
                            method: "function plants(uint256) view returns (string species, string name, address currentSteward, uint256 lastProofTime, string latestPhotoIPFS, bool isMemorialized)",
                            params: [tokenId]
                        });

                        fetchedPlants.push({
                            id: tokenId,
                            species: plantDetails[0],
                            name: plantDetails[1],
                            currentSteward: plantDetails[2],
                            lastProofTime: plantDetails[3],
                            latestPhotoIPFS: plantDetails[4],
                            isMemorialized: plantDetails[5]
                        });
                    } catch (innerErr) {
                        console.warn(`Failed to fetch token at index ${i}`, innerErr);
                        continue;
                    }
                }
                setPlants(fetchedPlants);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (balance) {
            fetchPlants();
        }
    }, [balance, account?.address, contract]);

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-green-600 font-bold uppercase tracking-widest text-sm mb-2">My Collection</h2>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">Greenhouse</h1>
                    </div>
                    {account && (
                        <div className="text-right">
                            <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm border border-green-100 text-sm">
                                <span className="text-gray-500">Total Plants:</span> <span className="font-bold text-green-700">{Number(balance || 0)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {!account && (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-green-50 max-w-lg mx-auto">
                        <div className="text-4xl mb-6">👛</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Connected</h3>
                        <p className="text-gray-500 mb-6">Please connect your wallet to view your garden.</p>
                    </div>
                )}

                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-green-100 rounded-2xl"></div>
                        ))}
                    </div>
                )}

                {!loading && plants.length === 0 && account && (
                    <div className="bg-white rounded-2xl p-16 text-center shadow-lg border border-green-50 max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🌱</div>
                        <h3 className="text-2xl font-bold text-gray-900 font-serif mb-4">Your Garden is Empty</h3>
                        <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                            Start your journey by registering your first plant or adopting one from the community.
                        </p>
                        <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-1">
                            Register a Plant
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {plants.map((plant) => (
                        <PlantCard
                            key={plant.id.toString()}
                            id={plant.id}
                            name={plant.name}
                            species={plant.species}
                            photo={plant.latestPhotoIPFS}
                            lastProofTime={plant.lastProofTime}
                            isMemorialized={plant.isMemorialized}
                            currentSteward={plant.currentSteward}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
