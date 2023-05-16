import { Link } from "react-router-dom";
import "./Post.css"
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMessage, faPaperPlane, faShare, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { errorNotify, successNotify } from "../toast/toast";
const Post = ({ data }) => {
    const { user } = useContext(AuthContext);
    const [openContact, setContact] = useState(null);
    const [taskComplete, setTaskComplete] = useState(null);
    const handleClick = () => {
        setContact({
            email: data.email,
            postId: data._id,
            text: '',
        })
    }
    const handleSubmit = async () => {
        try {
            await axios.post('/api/chat/sharePost', openContact);
            successNotify("Shared Successfully!");
            setContact(null);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    const handleTaskCompleteSubmit = async () => {
        try {
            await axios.post('/api/notification/taskCompleteThanks', taskComplete);
            successNotify("Thanks Sent!");
            setTaskComplete(null);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    const handleCompleteTask = () => {
        setTaskComplete({
            postId: data._id,
            email: data.email,
        })
    }
    return (
        <div class="mydiv">
            <div id="alluserimg2">
                <div class="post">
                    <div class="postWrapper">
                        <div class="postTop">
                            <Link to={`/profile/${data.email}`}>
                                <div class="postTopLeft"><img class="postProfileImg"
                                    src={data.userprofile ? data.userprofile : '/img/dummy_user.jpg'}
                                    alt={data.username} /><span class="postUsername">{data.username === user.username ? "You" : data.username}</span></div></Link>  <div class="time">{data.createdAt}</div>
                        </div>
                        <div class="postCenter"><span class="postText">{data.text} </span><img class="postImg"
                            src={data.photo}
                            alt="" />
                        </div>
                        <div className="postBottom">
                            {user.email !== data.email ?
                                <div className="btns">Contact<FontAwesomeIcon icon={faMessage} /></div> :
                                (
                                    taskComplete ?
                                        <div className="btns">
                                            <button onClick={() => { setTaskComplete(null) }} >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                            <div className="share_input_box">
                                                <input onChange={(e) => { setTaskComplete({ ...taskComplete, email: e.target.value }) }} type="email" name="email" id="email" placeholder="Give Thanks to..." />
                                            </div>
                                            <button type="submit" onClick={handleTaskCompleteSubmit}>
                                                <FontAwesomeIcon icon={faHeart} />
                                            </button>
                                        </div>
                                        :
                                        <div className="btns" onClick={handleCompleteTask}>
                                            Mark As Completed
                                            <FontAwesomeIcon icon={faMessage} />
                                        </div>
                                )
                            }
                            <div className="btns">{openContact ? (<div><button ><FontAwesomeIcon icon={faXmark} /></button> <div className="share_input_box"> <input onChange={(e) => { setContact({ ...openContact, email: e.target.value }) }} type="email" name="email" id="email" placeholder="Enter Email of recevier" /><br /> <input onChange={(e) => { setContact({ ...openContact, "text": e.target.value }) }} type="text" name="text_msz" id="text_msz" placeholder="Enter Message..." /> </div><button type="submit" onClick={handleSubmit}><FontAwesomeIcon icon={faPaperPlane} /></button> </div>) : (<div onClick={handleClick}>Share < FontAwesomeIcon icon={faShare} /></div>)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Post;