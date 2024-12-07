import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';

type Post = {
    _id: string;
    title: string;
    message: string;
    user: string;
    content: string;
    timestamp: string;
};

type HomePageProps = {
    posts: Post[];
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
    try {
        const { data } = await axios.get('/api'); // Replace with your JSON API URL
        return {
            props: {
                posts: data.data, // Access the "data" array from your JSON response
            },
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: {
                posts: [],
            },
        };
    }
};

const HomePage: NextPage<HomePageProps> = ({ posts }) => {
    return (
        <div>
            <h1>Posts</h1>
            <div>
                {posts.map((post) => (
                    <div key={post._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                        <h2>{post.title}</h2>
                        <p><strong>Message:</strong> {post.message}</p>
                        <p><strong>User:</strong> {post.user}</p>
                        <p><strong>Content:</strong> {post.content}</p>
                        <p><strong>Timestamp:</strong> {new Date(post.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;