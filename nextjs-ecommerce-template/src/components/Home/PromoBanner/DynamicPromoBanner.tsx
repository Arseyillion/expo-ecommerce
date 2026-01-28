"use client"
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface PromoBannerData {
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    discount?: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    image?: string;
    imagePosition: "left" | "right" | "bottom";
    size: "large" | "small";
    isActive: boolean;
    priority: number;
}

const DynamicPromoBanner = () => {
    const { data: bannersData, isLoading, error } = useQuery({
        queryKey: ['promoBanners'],
        queryFn: async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/promo-banners/active`);
            if (!response.ok) {
                throw new Error('Failed to fetch promo banners');
            }
            const data = await response.json();
            if (data.success) {
                console.log(`the data from promo banners: ${JSON.stringify(data.data)}`);
                return data.data;
            }
            throw new Error('Invalid response format');
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });

    const banners = bannersData || [];

    if (isLoading) {
        return (
            <section className="overflow-hidden py-20">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="animate-pulse">
                        <div className="bg-gray-200 h-64 rounded-lg mb-7.5"></div>
                        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
                            <div className="bg-gray-200 h-48 rounded-lg"></div>
                            <div className="bg-gray-200 h-48 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || banners.length === 0) {
        // Log error for debugging
        if (error) {
            console.error('Error fetching promo banners:', error);
        }
        
        // Fallback to static content if error or no banners
        return (
            <section className="overflow-hidden py-20">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    {/* Static fallback content */}
                    <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
                        <div className="max-w-[550px] w-full">
                            <span className="block font-medium text-xl text-dark mb-3">
                                Special Offer
                            </span>
                            <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
                                UP TO 30% OFF
                            </h2>
                            <p>
                                Check out our amazing deals on selected products. Limited time offer!
                            </p>
                            <Link
                                href="/shop-with-sidebar"
                                className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Separate large and small banners
    const largeBanners = banners.filter(b => b.size === "large");
    const smallBanners = banners.filter(b => b.size === "small");

    const renderBanner = (banner: PromoBannerData, isLarge: boolean = true) => {
        // Map colors to Tailwind classes
        const getButtonClass = (color: string) => {
            const colorMap: { [key: string]: string } = {
                '#3B82F6': 'bg-blue hover:bg-blue-dark',
                '#14B8A6': 'bg-teal hover:bg-teal-dark', 
                '#F97316': 'bg-orange hover:bg-orange-dark',
            };
            return colorMap[color] || 'bg-blue hover:bg-blue-dark';
        };

        const getDiscountClass = (color: string) => {
            const colorMap: { [key: string]: string } = {
                '#3B82F6': 'text-blue',
                '#14B8A6': 'text-teal',
                '#F97316': 'text-orange',
            };
            return colorMap[color] || 'text-blue';
        };

        if (isLarge) {
            return (
                <div key={banner._id} className="relative z-1 overflow-hidden rounded-lg py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5" style={{ backgroundColor: banner.backgroundColor }}>
                    <div className="max-w-[550px] w-full">
                        {banner.subtitle && (
                            <span className="block font-medium text-xl text-dark mb-3">
                                {banner.subtitle}
                            </span>
                        )}
                        <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
                            {banner.title}
                        </h2>
                        {banner.description && (
                            <p>
                                {banner.description}
                            </p>
                        )}
                        {banner.discount && (
                            <p className={`font-semibold text-custom-1 ${getDiscountClass(banner.buttonColor)} mb-2.5`}>
                                {banner.discount}
                            </p>
                        )}
                        <Link
                            href={banner.buttonLink}
                            className={`inline-flex font-medium text-custom-sm text-white ${getButtonClass(banner.buttonColor)} py-[11px] px-9.5 rounded-md ease-out duration-200 mt-7.5`}
                        >
                            {banner.buttonText}
                        </Link>
                    </div>
                    {banner.image && (
                        <Image
                            src={banner.image}
                            alt="promo img"
                            className="absolute bottom-0 right-4 lg:right-26 -z-1"
                            width={274}
                            height={350}
                        />
                    )}
                </div>
            );
        } else {
            // Small banner
            const isLeft = banner.imagePosition === "left";
            const textClass = isLeft ? "text-right" : "";
            const imageClass = isLeft 
                ? "absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1"
                : "absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1";

            return (
                <div key={banner._id} className="relative z-1 overflow-hidden rounded-lg py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10" style={{ backgroundColor: banner.backgroundColor }}>
                    {banner.image && (
                        <Image
                            src={banner.image}
                            alt="promo img"
                            className={imageClass}
                            width={241}
                            height={241}
                        />
                    )}
                    <div className={textClass}>
                        {banner.subtitle && (
                            <span className="block text-lg text-dark mb-1.5">
                                {banner.subtitle}
                            </span>
                        )}
                        <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                            {banner.discount && banner.discount.includes('%') ? (
                                <>
                                    Up to <span className={getDiscountClass(banner.buttonColor)}>{banner.discount}</span> off
                                </>
                            ) : (
                                banner.title
                            )}
                        </h2>
                        {banner.discount && !banner.discount.includes('%') && (
                            <p className={`font-semibold text-custom-1 ${getDiscountClass(banner.buttonColor)}`}>
                                {banner.discount}
                            </p>
                        )}
                        {banner.description && (
                            <p className="max-w-[285px] text-custom-sm">
                                {banner.description}
                            </p>
                        )}
                        <Link
                            href={banner.buttonLink}
                            className={`inline-flex font-medium text-custom-sm text-white ${getButtonClass(banner.buttonColor)} py-2.5 px-8.5 rounded-md ease-out duration-200 mt-7.5`}
                        >
                            {banner.buttonText}
                        </Link>
                    </div>
                </div>
            );
        }
    };

    return (
        <section className="overflow-hidden py-20">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                {/* Render large banners */}
                {largeBanners.map(banner => renderBanner(banner, true))}

                {/* Render small banners in grid */}
                {smallBanners.length > 0 && (
                    <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
                        {smallBanners.map(banner => renderBanner(banner, false))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DynamicPromoBanner;
