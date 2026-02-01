"use client";

import Link from "next/link";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/config";
import { usePathname } from "next/navigation";
import { sepolia } from "thirdweb/chains";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import clsx from "clsx";

export function Navbar() {
    const pathname = usePathname();

    const wallets = [
        inAppWallet({
            auth: {
                options: ["google", "email", "facebook", "apple"],
            },
            smartAccount: {
                chain: sepolia,
                sponsorGas: true,
            },
        }),
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
    ];

    const navLinks = [
        { href: "/", label: "Sanctuary" },
        { href: "/my-plants", label: "My Greenhouse" },
        { href: "/my-badges", label: "Badges" },
    ];

    return (
        <nav className="border-b border-green-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <span className="text-3xl">🌿</span>
                        <Link href="/" className="text-2xl font-bold text-green-800 tracking-tight font-serif">
                            Nomadic Plants
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200",
                                    pathname === link.href
                                        ? "border-green-600 text-green-900"
                                        : "border-transparent text-gray-500 hover:text-green-700 hover:border-green-200"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Wallet Button */}
                    <div className="flex items-center">
                        <ConnectButton
                            client={client}
                            wallets={wallets}
                            theme="light"
                            connectButton={{
                                style: {
                                    backgroundColor: "#16a34a", // green-600
                                    color: "white",
                                    fontWeight: "600",
                                    borderRadius: "9999px",
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
