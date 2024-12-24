"use client";
import { useEffect, useState, use } from "react";

const MyPage = ({ params }: { params: Promise<{ item: string }> }) => {
    // Use React.use() to unwrap the `params` Promise
    const { item } = use(params);

    const [itemData, setItemData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/items/${item}`);
            const data = await response.json();
            setItemData(data);
        };

        fetchData();
    }, [item]);

    return (
        <div>
            <h1>Item: {item}</h1>
            {itemData ? (
                <div>
                    <p>{JSON.stringify(itemData)}</p> {/* Display your item data */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MyPage;