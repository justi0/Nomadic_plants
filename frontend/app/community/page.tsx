"use client";

import { Navbar } from "@/components/Navbar";
import { useReadContract } from "thirdweb/react";
import { getContract, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/config";
import { useEffect, useState } from "react";
import { PlantCard } from "@/components/PlantCard";

const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_PLANT_REGISTRY_ADDRESS as `0x${string}`;

export default function CommunityPage() {
    const [allPlants, setAllPlants] = useState<any[]>([]);
    const [isLoadingAll, setIsLoadingAll] = useState(true);

    const contract = getContract({
        client,
        chain: sepolia,
        address: REGISTRY_ADDRESS,
    });

    // 1. Get Total Supply
    const { data: totalSupply, isLoading: isSupplyLoading } = useReadContract({
        contract,
        method: "function totalSupply() view returns (uint256)",
        params: [],
    });

    // 2. Fetch all plants when supply is known
    const [showAdoptable, setShowAdoptable] = useState(false);

    useEffect(() => {
        const fetchAllPlants = async () => {
            if (totalSupply === undefined) return;

            try {
                const total = Number(totalSupply);
                const plantPromises = [];

                for (let i = 0; i < total; i++) {
                    const p = (async () => {
                        const tokenId = await readContract({
                            contract,
                            method: "function tokenByIndex(uint256 index) view returns (uint256)",
                            params: [BigInt(i)],
                        });

                        const plant = await readContract({
                            contract,
                            method: "function getPlant(uint256 plantId) view returns ((string species, string name, address currentSteward, uint256 lastProofTime, string latestPhotoIPFS, bool isMemorialized, address[] stewards, bool isUpForAdoption, string location))",
                            params: [tokenId],
                        });

                        return {
                            id: tokenId,
                            species: plant.species,
                            name: plant.name,
                            currentSteward: plant.currentSteward,
                            lastProofTime: plant.lastProofTime,
                            latestPhotoIPFS: plant.latestPhotoIPFS,
                            isMemorialized: plant.isMemorialized,
                            stewards: plant.stewards,
                            isUpForAdoption: plant.isUpForAdoption,
                            location: plant.location,
                        };
                    })();
                    plantPromises.push(p);
                }

                const results = await Promise.all(plantPromises);
                setAllPlants(results);
            } catch (err) {
                console.error("Error fetching community plants:", err);
            } finally {
                setIsLoadingAll(false);
            }
        };

        if (totalSupply !== undefined) {
            fetchAllPlants();
        }
    }, [totalSupply, contract]);

    const filteredPlants = showAdoptable
        ? allPlants.filter(p => p.isUpForAdoption)
        : allPlants;

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-800 text-xs font-bold tracking-widest uppercase mb-4">
                        Global Sanctuary
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-4">
                        Community Garden
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                        Explore every living soul rooted in the blockchain.
                        Witness the collective legacy of our stewards.
                    </p>

                    {/* Filter Toggle */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowAdoptable(!showAdoptable)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${showAdoptable
                                ? "bg-blue-600 text-white shadow-lg scale-105"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                                }`}
                        >
                            <span>{showAdoptable ? "🌍 Showing Adoptable Only" : "🔍 Browse All Plants"}</span>
                            {showAdoptable && <span onClick={(e) => { e.stopPropagation(); setShowAdoptable(false); }} className="ml-2 hover:text-blue-200">✕</span>}
                        </button>
                    </div>
                </div>

                {isSupplyLoading || isLoadingAll ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse bg-white rounded-3xl h-96 shadow-sm border border-gray-100"></div>
                        ))}
                    </div>
                ) : filteredPlants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPlants.map((plant) => (
                            <PlantCard
                                key={plant.id.toString()}
                                id={plant.id}
                                name={plant.name}
                                species={plant.species}
                                photo={plant.latestPhotoIPFS}
                                lastProofTime={plant.lastProofTime}
                                isMemorialized={plant.isMemorialized}
                                currentSteward={plant.currentSteward}
                                isUpForAdoption={plant.isUpForAdoption}
                                location={plant.location}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-4xl mb-4">🌱</div>
                        <h3 className="text-xl font-bold text-gray-900 font-serif mb-2">The Garden is Empty</h3>
                        <p className="text-gray-500 mb-6">Be the first to plant a seed in this digital soil.</p>
                        <a href="/register" className="inline-block px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow hover:bg-green-700 transition">
                            Register a Plant
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
