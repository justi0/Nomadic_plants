import Link from "next/link";
import clsx from "clsx";

interface PlantCardProps {
    id: bigint;
    name: string;
    species: string;
    photo: string;
    lastProofTime: bigint; // Unix timestamp
    isMemorialized: boolean;
    currentSteward: string;
}

function timeAgo(timestamp: bigint) {
    if (!timestamp) return "Never";
    const seconds = Math.floor(Date.now() / 1000) - Number(timestamp);
    const days = Math.floor(seconds / (3600 * 24));
    if (days < 0) return "Just now";
    return `${days} days ago`;
}

export function PlantCard({ id, name, species, photo, lastProofTime, isMemorialized, currentSteward }: PlantCardProps) {
    const daysSinceProof = Math.floor((Date.now() / 1000 - Number(lastProofTime)) / (3600 * 24));
    const isHealthy = daysSinceProof <= 30;

    const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL
        ? `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${photo}`
        : `https://gateway.pinata.cloud/ipfs/${photo}`;

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
            <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                    src={photo ? gatewayUrl : "/placeholder-plant.png"}
                    alt={name}
                    className={clsx(
                        "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                        isMemorialized && "grayscale"
                    )}
                />

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    {isMemorialized ? (
                        <span className="px-3 py-1 bg-gray-900/80 backdrop-blur text-white text-xs font-bold uppercase tracking-wider rounded-full">
                            Memorial
                        </span>
                    ) : (
                        <span className={clsx(
                            "px-3 py-1 backdrop-blur text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm",
                            isHealthy ? "bg-green-500/90" : "bg-red-500/90"
                        )}>
                            {isHealthy ? "Healthy" : "Needs Care"}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest">{species}</p>
                    <h3 className="text-2xl font-bold text-gray-900 font-serif mt-1 group-hover:text-green-700 transition-colors">
                        {name}
                    </h3>
                </div>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                        <span>Last Care</span>
                        <span className="font-medium text-gray-700">{timeAgo(lastProofTime)}</span>
                    </div>

                    <Link
                        href={`/plant/${id}`}
                        className="block w-full text-center px-4 py-3 border border-green-200 text-green-700 font-semibold rounded-xl hover:bg-green-50 hover:border-green-300 transition-colors"
                    >
                        View Passport
                    </Link>
                </div>
            </div>
        </div>
    );
}
