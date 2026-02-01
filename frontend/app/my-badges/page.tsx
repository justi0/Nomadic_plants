"use client";

import { Navbar } from "@/components/Navbar";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/config";
import { useEffect, useState, useMemo } from "react";

const BADGE_ADDRESS = process.env.NEXT_PUBLIC_STEWARD_BADGE_ADDRESS as `0x${string}`;

export default function MyBadges() {
    const account = useActiveAccount();
    const [badges, setBadges] = useState<bigint[]>([]);
    const [loading, setLoading] = useState(false);

    const contract = useMemo(() => getContract({
        client,
        chain: sepolia,
        address: BADGE_ADDRESS,
    }), []);

    const { data: balance } = useReadContract({
        contract,
        method: "function balanceOf(address owner) view returns (uint256)",
        params: [account?.address || "0x0000000000000000000000000000000000000000"],
        queryOptions: { enabled: !!account }
    });

    useEffect(() => {
        async function fetchBadges() {
            if (!balance || !account || !BADGE_ADDRESS) return;
            setLoading(true);
            try {
                const fetchedBadges: bigint[] = [];
                const count = Number(balance);
                for (let i = 0; i < count; i++) {
                    const tokenId = await readContract({
                        contract,
                        method: "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
                        params: [account.address, BigInt(i)]
                    });
                    fetchedBadges.push(tokenId);
                }
                setBadges(fetchedBadges);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (balance) {
            fetchBadges();
        }
    }, [balance, account?.address, contract]);

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-green-600 font-bold uppercase tracking-widest text-sm mb-2">Reputation</h2>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">Steward Badges</h1>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Badges are minted when you successfully transfer stewardship of a plant, proving your contribution to the network.
                    </p>
                </div>

                {!account && <div className="text-center py-10 text-gray-500">Please connect your wallet to view badges.</div>}
                {loading && <div className="text-center py-10 text-green-600">Loading your reputation...</div>}

                {!loading && badges.length === 0 && account && (
                    <div className="text-center py-20 px-6 border-2 border-dashed border-green-200 rounded-3xl">
                        <div className="text-6xl mb-6 opacity-30">🛡️</div>
                        <p className="text-xl font-bold text-gray-400">No Badges Earned Yet</p>
                        <p className="text-gray-500 mt-2">Transfer a plant to a new shepherd to earn your first badge.</p>
                    </div>
                )}

                {!loading && (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {badges.map((id) => (
                            <div key={id.toString()} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center justify-center text-center border border-green-100 hover:border-green-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10 font-bold text-4xl text-green-900">#{(Number(id) + 1).toString().padStart(3, '0')}</div>

                                <div className="h-24 w-24 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white">
                                    <span className="text-5xl drop-shadow-sm">🏅</span>
                                </div>

                                <h3 className="font-bold text-gray-900">Guardian</h3>
                                <p className="text-xs text-green-500 uppercase font-bold tracking-wider mt-1">Level 1</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
