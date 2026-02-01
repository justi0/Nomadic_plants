import { useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useSendTransaction } from "thirdweb/react";
import { client } from "@/lib/config";
import clsx from "clsx";
import { useRouter } from "next/navigation";

const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_PLANT_REGISTRY_ADDRESS as `0x${string}`;

interface MemorializeModalProps {
    plantId: bigint;
    isOpen: boolean;
    onClose: () => void;
}

export function MemorializeModal({ plantId, isOpen, onClose }: MemorializeModalProps) {
    const { mutateAsync: sendTransaction, isPending } = useSendTransaction();
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    if (!isOpen) return null;

    const handleMemorialize = async () => {
        setError(null);
        if (!REGISTRY_ADDRESS) return;

        try {
            const contract = getContract({
                client,
                chain: sepolia,
                address: REGISTRY_ADDRESS,
            });

            const transaction = prepareContractCall({
                contract,
                method: "function memorializePlant(uint256 plantId)",
                params: [plantId],
            });

            await sendTransaction(transaction);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                window.location.reload(); // Reload to show new state
            }, 2500);
        } catch (err) {
            console.error(err);
            setError(err as Error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <span className="text-4xl block mb-2">🪦</span>
                    <h2 className="text-2xl font-bold text-gray-900 font-serif">Memorialize Plant</h2>
                </div>

                {!isSuccess ? (
                    <div className="space-y-4">
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-left">
                            <h4 className="font-bold text-amber-800 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Permanent Action
                            </h4>
                            <p className="text-sm text-amber-700 mt-1">
                                Memorializing a plant will <strong>permanently freeze</strong> its state on the blockchain.
                            </p>
                            <ul className="text-sm text-amber-700 mt-2 list-disc list-inside">
                                <li>No more photo updates</li>
                                <li>Cannot be transferred</li>
                                <li>Will be displayed as a memorial forever</li>
                            </ul>
                        </div>

                        <p className="text-gray-600 text-sm">
                            Only do this if the physical plant has died or returned to the earth.
                        </p>

                        <button
                            onClick={handleMemorialize}
                            disabled={isPending}
                            className={clsx(
                                "w-full py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg",
                                isPending
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700 shadow-red-200"
                            )}
                        >
                            {isPending ? "Freezing State..." : "Confirm Memorialization"}
                        </button>

                        {error && (
                            <div className="text-red-500 text-sm text-center mt-2">
                                {error.message}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-green-900 mb-2">Rest in Peace</h3>
                        <p className="text-gray-500">The plant's memory has been preserved forever.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
