"use client"
import { useEffect, useState } from 'react';

const MyPage = ({ params }: { params: { item: string } }) => {
    const [itemData, setItemData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/items/${params.item}`); // Adjust the API endpoint as needed
            const data = await response.json();
            setItemData(data);
        };

        fetchData();
    }, [params.item]);

    return (
        <div>
            <h1>Item: {params.item}</h1>
            {itemData ? (
                <div>
                    <p>{JSON.stringify(itemData)}</p> {/* Display your item data here */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MyPage;
