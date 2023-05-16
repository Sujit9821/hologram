import { useContext, useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Feed from "../../components/feed/Feed";
import Post from "../../components/post/Post";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Leftbox from "../../components/leftbox/Leftbox";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    const [posts, setPosts] = useState(null);
    const [searchURL, setSearchURL] = useState('')
    const navigate = useNavigate();
    const getPosts = async () => {
        try {
            setPosts(null);
            let data = await axios.get(searchURL);
            data = data.data;
            setPosts(data);
        } catch (err) {
            navigate('/login');
        }
    }
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if (searchURL !== '') {
            getPosts();
        }
    }, [searchURL])
    return (
        <div>
            <Header mode={"Home"} />
            <Feed />
            {user && <Leftbox data={user} changeURL={setSearchURL} />}
            {
                posts ?
                    posts.map(post => (<Post data={post} />)) : <div className="mydiv" style={{display:"flex",justifyContent:"center"}}><div className="Loader_icon"><FontAwesomeIcon icon={faSpinner} /></div></div>
            }
        </div>
    )
}

export default Home;