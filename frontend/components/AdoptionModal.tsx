import { useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useSendTransaction } from "thirdweb/react";
import { client } from "@/lib/config";
import clsx from "clsx";

const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_PLANT_REGISTRY_ADDRESS as `0x${string}`;

interface AdoptionModalProps {
    plantId: bigint;
    isOpen: boolean;
    onClose: () => void;
}

export function AdoptionModal({ plantId, isOpen, onClose }: AdoptionModalProps) {
    const [location, setLocation] = useState("");
    const { mutateAsync: sendTransaction, isPending } = useSendTransaction();
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!location.trim()) {
            alert("Please enter a location");
            return;
        }

        try {
            const contract = getContract({
                client,
                chain: sepolia,
                address: REGISTRY_ADDRESS,
            });

            const transaction = prepareContractCall({
                contract,
                method: "function listForAdoption(uint256 plantId, string memory location)",
                params: [plantId, location],
            });

            await sendTransaction(transaction);
            setIsSuccess(true);
        } catch (err) {
            console.error(err);
            setError(err as Error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-green-950/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 overflow-hidden transform transition-all border border-blue-100">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-50"></div>

                <h2 className="text-2xl font-bold text-gray-900 font-serif mb-2 relative">List for Adoption 🌍</h2>
                <p className="text-gray-500 text-sm mb-6 relative">
                    Can't care for this plant anymore? List it for the community to adopt.
                </p>

                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Current Location (City)</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Chiang Mai, Thailand"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-white text-gray-700 border border-gray-300 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className={clsx(
                                    "flex-1 font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-white",
                                    isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"
                                )}
                            >
                                {isPending ? "Listing..." : "Confirm List"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        <div className="text-5xl mb-4">🌍</div>
                        <h3 className="text-xl font-bold text-green-800 mb-2">Listed!</h3>
                        <p className="text-gray-600 text-sm mb-6">Your plant is now visible in the Community Garden for adoption.</p>
                        <button
                            onClick={onClose}
                            className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 transition"
                        >
                            Close
                        </button>
                    </div>
                )}
                {error && (
                    <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-100">
                        <h3 className="text-sm font-bold text-red-800 mb-1">Error</h3>
                        <p className="text-sm text-red-700 break-words">{error.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
