import { useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useSendTransaction } from "thirdweb/react";
import { client } from "@/lib/config";
import clsx from "clsx";

const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_PLANT_REGISTRY_ADDRESS as `0x${string}`;

interface TransferModalProps {
    plantId: bigint;
    isOpen: boolean;
    onClose: () => void;
}

export function TransferModal({ plantId, isOpen, onClose }: TransferModalProps) {
    const [recipient, setRecipient] = useState("");
    const { mutateAsync: sendTransaction, isPending } = useSendTransaction();
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    if (!isOpen) return null;

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
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
                method: "function transferStewardship(uint256 plantId, address newSteward)",
                params: [plantId, recipient],
            });

            await sendTransaction(transaction);
            setIsSuccess(true);

            // Auto-close after 2 seconds
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setRecipient("");
            }, 2500);
        } catch (err) {
            console.error(err);
            setError(err as Error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-green-950/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 overflow-hidden transform transition-all border border-green-100">
                {/* Decorative header blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full blur-2xl opacity-50"></div>

                <h2 className="text-2xl font-bold text-gray-900 font-serif mb-2 relative">Transfer Stewardship 🤝</h2>
                <p className="text-gray-500 text-sm mb-6 relative">
                    Pass this plant to a new guardian. You will receive a Steward Badge for your care.
                </p>

                <form onSubmit={handleTransfer} className="space-y-6">
                    <div>
                        <label htmlFor="recipient" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            New Steward Address
                        </label>
                        <input
                            type="text"
                            id="recipient"
                            required
                            placeholder="0x..."
                            className="block w-full rounded-xl border-gray-300 bg-gray-50 focus:bg-white px-4 py-3 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm transition-all shadow-sm border"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white text-gray-700 border border-gray-300 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={clsx(
                                "flex-1 border border-transparent font-bold py-3 px-4 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all text-white",
                                isPending
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-green-500/30"
                            )}
                        >
                            {isPending ? "Transferring..." : "Confirm Transfer"}
                        </button>
                    </div>

                    {isSuccess && (
                        <div className="rounded-xl bg-green-50 p-4 border border-green-100">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-bold text-green-800">Success!</h3>
                                    <div className="mt-1 text-sm text-green-700">
                                        <p>The plant has started its new journey.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                            <h3 className="text-sm font-bold text-red-800 mb-1">Error</h3>
                            <p className="text-sm text-red-700 break-words">{error.message}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
