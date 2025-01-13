"use client"
import dynamic from "next/dynamic";
import { useMemo } from "react";

const Map = dynamic(
    () => import('@/components/map/'),
    {
        loading: () => <p>A map is loading</p>,
        ssr: false
    }
);

export default function Page() {
    const MemoizedMap = useMemo(() => <Map posix={[51.5074, -0.1278]} />, []);

    return (
        <>
            <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
                {MemoizedMap}
            </div>
        </>
    )
}