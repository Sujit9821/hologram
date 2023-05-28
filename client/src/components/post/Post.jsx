import { Link } from "react-router-dom";
import "./Post.css"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faEllipsis, faHeart, faMessage, faPaperPlane, faShare, faSpinner, faThumbTack, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { errorNotify, successNotify, warningNotify } from "../toast/toast";
import Comment from "../comment/Comment";
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
    const [post_like, setPost_like] = useState(data.user_like);
    const handle_like = async () => {
        setPost_like(!post_like);
        await axios.get(`/api/post/like/${data._id}`);
    }
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(null);
    const fetchComments = async () => {
        try {
            let res = await axios.get(`/api/post/comments/${data._id}`);
            setComments(res.data);
        } catch (err) {
            errorNotify(err.response.data.message || "Something went Wrong")
        }
    }
    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments])
    const addComment = async () => {
        const comment = document.getElementById('comment').value;
        if (comment) {
            try {
                await axios.post(`/api/post/addComment/${data._id}`, { comment })
                successNotify("Shared Successfully!");
            } catch (err) {
                console.log(err);
                errorNotify(err.response.data.message || "Something went Wrong")
            }
        } else {
            warningNotify("Write Something to Comment!");
        }
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
                                    alt={data.username} />
                                    <div className="div_post_left">
                                        <span class="postUsername">{data.username === user.username ? "You" : data.username}</span>
                                        <div class="time">{data.createdAt}</div>
                                    </div>
                                </div>
                            </Link>
                            <div className="post_menu"><FontAwesomeIcon icon={faEllipsis} /></div>
                        </div>
                        <div class="postCenter"><span class="postText">{data.text} </span><img class="postImg"
                            src={data.photo}
                            alt="" />
                        </div>
                        <hr />
                        <div className="like_comments">
                            <div className="like_number" ><FontAwesomeIcon icon={faHeart} />{(data.likes ? data.likes : 0) - data.user_like + post_like} Likes</div>
                            <div className="comment_number">{data.comments} Comments</div>
                        </div>
                        <hr className="post_hr" />
                        <div className="postBottom">
                            <div className={post_like ? "btns liked" : "btns disliked"}> <FontAwesomeIcon icon={faHeart} /> <span onClick={handle_like} >Like</span> </div>
                            <div className="btns" onClick={() => { setShowComments(!showComments) }}><FontAwesomeIcon icon={faComments} />Comment</div>
                            <div className="btns">
                                {openContact ? (
                                    <div>
                                        <button >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                        <div className="share_input_box">
                                            <input onChange={(e) => { setContact({ ...openContact, email: e.target.value }) }} type="email" name="email" id="email" placeholder="Enter Email of recevier" />
                                            <br />
                                            <input onChange={(e) => { setContact({ ...openContact, "text": e.target.value }) }} type="text" name="text_msz" id="text_msz" placeholder="Enter Message..." />
                                        </div>
                                        <button type="submit" onClick={handleSubmit}>
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </div>) : (
                                    <div onClick={handleClick}>
                                        < FontAwesomeIcon icon={faShare} />Share
                                    </div>)}
                            </div>
                        </div>
                    </div>
                    {showComments &&
                        <div className="comments">
                            <div>
                                {
                                    comments ?
                                        (
                                            comments.map(comment => (
                                                <Comment data={comment} />
                                            ))
                                        ) : <div className="Loader_icon" style={{ margin: "auto", width: "max-content" }}><FontAwesomeIcon icon={faSpinner} /></div>
                                }
                            </div>
                            <div className="addComment">
                                <Link to={`/profile/${data.email}`}>
                                    <img class="postProfileImg"
                                        src={data.userprofile ? data.userprofile : '/img/dummy_user.jpg'}
                                        alt={data.username} />
                                </Link>
                                <input type="text" name="comment" id="comment" placeholder="Write Comment..." />
                                <button onClick={addComment} className="addCommentBtn">Add</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    );
}

export default Post;