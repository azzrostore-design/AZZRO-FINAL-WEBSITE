import Link from "next/link";
import Image from "next/image";
import { CategoryTile } from "@/lib/cms-data";

export function CategoryRail({ categories }: { categories: CategoryTile[] }) {
    return (
        <section className="py-10 container mx-auto px-4">
            <h3 className="text-2xl font-bold mb-8 tracking-tight uppercase text-center md:text-left">Shop By Category</h3>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={cat.link}
                        className="flex-shrink-0 group snap-center"
                    >
                        <div className="w-[120px] md:w-[150px] flex flex-col items-center gap-3">
                            <div className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 group-hover:scale-105 transition-transform duration-300">
                                <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-white bg-white">
                                    <Image
                                        src={cat.imageUrl}
                                        alt={cat.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Glass overlay */}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                </div>
                            </div>
                            <span className="font-bold text-sm tracking-wide uppercase group-hover:text-accent transition-colors">{cat.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
