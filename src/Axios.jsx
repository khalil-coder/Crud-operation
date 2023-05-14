 import { useState, useEffect } from "react";
import api from "./api/post";

export default function Axios(){
  const [posts, setPosts] = useState([])
  const [postBody, setBody] = useState()
  const [postTitle, setTitle] = useState()
  const [postImage, setImage] = useState()
  
 const [editBody, setEditBody] = useState()
 const [editTitle, setEditTitle] = useState()
 const [editImage, setEditImage] = useState()
 const [resourceId, setResId] = useState()
 
 const [createPost, setCreate] = useState(false)
 const [editPost, setEdit] = useState(false)
 const [hideCreateButton, setButton] = useState("block")
  
  
  useEffect (()=>{
    const fetchPosts = async ()=>{
      try{
        const response = await api.get("/posts")
        setPosts(response.data)
      }
      catch(error){
        alert(error)
      } }
      fetchPosts()
  }, [resourceId, editBody, editTitle])
  const ImageUpload = (e) =>{
    const file = e.target.files[0]
   const fileSize = (file.size/(1024**2)).toFixed(1)
    const reader = new FileReader()
    reader.addEventListener("load", ()=>{fileSize <= 2.4 ? setImage(reader.result): alert(`File size has exceeded the required size. File size: ${fileSize}mb. Required size: 0.1mb ~2.4mb. ${setImage("")}`)})
    reader.readAsDataURL(file)
  }
  const handleSubmit = async (e) =>{
    e.preventDefault()
    const id = posts.length ? posts[posts.length-1].id +1 : 1
    const datetime = new Date()
    const newPost = {id, title: postTitle, datetime, body: postBody, image: postImage}
    const allPosts = [...posts, newPost]
   
    try{
      await api.post("/posts", newPost)
     setPosts(allPosts)
    }
    catch(error){alert(error)}
    e.target.reset()
  }
  const handleDelete = async (id) =>{
    const filtered = posts.filter(post => post.id != id)
    try{
    await api.delete(`posts/${confirm("Are you sure deleting this post?") && id}`);  setPosts(filtered)
    }
    catch(error){console.log(error)}
    
  }
  const handleEdit = async id =>{
    setResId(id)
    setEdit(true)
    setCreate(false)
    const datetime = new Date()
    const editedPost = {id, title: editTitle, datetime, body: editBody, image: editImage}
    try{
      const response = await api.put(`posts/${id}`, editedPost)
    const edited = posts.map(post => post.id == id ? {...response.data} : post)
    setPosts(edited)
    }
    catch(error){alert(error)}
    const post = posts.find(post => post.id == id)
    setEditTitle(post.title)
    setEditBody(post.body)
    setEditImage(post.image)
  }
return (
    <>
    <h2 className="text-center alert alert-primary sticky-top"> CRUD OPERATION</h2>
    <div>
      {posts.map((post, index) => {
        return (
          <div className="card m-3">
            <>{post.image != undefined && <img src={post.image} alt={post.image} className="card-img-top" />}</>
            <header className="card-heading" >
              <h1 style={{textAlign:"center"}} className="card-title" >{post.title}</h1>
            </header>
            <div className="card-body">
            <p className="card-text">{post.body}</p>
            <br/>
            
            <button className="btn btn-outline-danger btn-sm me-3 ms-5" onClick={()=>handleDelete(post.id)}><i className="bi-basket3"></i> Delete post</button>
            <button className="btn btn-sm btn-outline-dark" onClick={()=>handleEdit(post.id)}><i className="bi-pencil"></i> Edit post</button>
            </div>
          </div>
        );
      })}
      <button className="btn btn-primary btn-sm ms-5 mb-3" style={{display: hideCreateButton}} onClick={()=>{setEdit(false); setCreate(true); setButton("none")}}>Create Post</button>
  </div>
  {createPost == true &&
    <div className="text-center">
    <h3>New Post</h3>
    <form onSubmit={ handleSubmit }>
    Title: <input type="text" onChange={(e)=> setTitle(e.target.value)}/><br/>
    Post:<br/> <textarea onChange={(e)=>setBody(e.target.value)
    }></textarea><br/>
    <input type="file" accept="image/*" className="btn btn-outline-success btn-sm m-2" onChange={ImageUpload}/>
    <input type="submit" className="btn btn-outline-success btn-sm m-2 pe-3 ps-3" value="Post" onClick={()=> setButton("block")}/>
    <input type="submit" className="btn btn-outline-warning btn-sm m-2 pe-3 ps-3" onClick={()=> {setCreate(false); setButton("block")}} value="Cancel"/>
    </form>
    </div>
  }
  
  {editPost == true &&
  <div className="text-center">
    <h3>Edit Post</h3>
    <form onSubmit={(e)=>e.preventDefault()}>
    Title: <input type="text"value={editTitle} onChange={(e)=>setEditTitle(e.target.value)}/><br/>
    Post:<br/> <textarea value={editBody}  onChange={(e)=>setEditBody(e.target.value)} ></textarea><br/>

    <input type="submit" className="btn btn-outline-success btn -sm m-2" onClick={()=> {handleEdit(resourceId); setEdit(false)}} value="Save changes"/>
    </form>
    </div>
   }
    </>
  );
}