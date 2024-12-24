import { GetServerSideProps, NextPage } from 'next';

interface MyPageProps {
    params: {
        item: string;
    };
}

const MyPage: NextPage<MyPageProps> = ({ params }) => {
    return (
        <div>
            <h1>Item: {params.item}</h1>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { item } = context.params as { item: string }; // Type assertion

    return {
        props: {
            params: {
                item,
            },
        },
    };
};

export default MyPage;
