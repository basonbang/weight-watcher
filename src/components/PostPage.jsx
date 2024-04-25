import React from 'react';
import { supabase } from '@/supabaseClient';
import { useState, useEffect } from 'react';  
import { useParams } from 'react-router-dom';
import { AspectRatio } from './ui/aspect-ratio';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Toaster } from './ui/toaster';
import { cn } from '@/lib/utils';

function PostPage({username}) {
  const [currentComments, setCurrentComments] = useState([])
  const [comment, setComment] = useState('');
  const [likes, setLikes] = useState();
  const [post, setPost] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { id } = useParams();
  const { toast } = useToast();

  // determine if post content is an image or video
  const isImage = post.content?.includes('jpg') || post.content?.includes('png') || post.content?.includes('gif');

  // toggle description expansion
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const updateLikes = async () => {
    try {
      const { data, error} = await supabase
        .from('Posts')
        .update({likes: likes + 1})
        .eq('id', id)
      setLikes(likes + 1)
      toast({
        className: 'bg-green-500 border-none',
        description: "You've upvoted this post.",
      })
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const insertCommentIntoDatabase = async () => {
    // Define new comment
    const newComment = {
      author: username,
      date: new Date().toLocaleDateString("en-US"),
      content: comment
    }
    
    try {
      // Fetch existing comments
      const { data: existingPost, error: fetchError} = await supabase
        .from('Posts')
        .select('comments')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching post: ', fetchError.message)
        return
      }

      // Append new comment to existing comments
      let updatedComments
      (!existingPost.comments) ? updatedComments = [newComment] : updatedComments = [...existingPost.comments, newComment]
    
      // Update post with new comments
      const { data, error } = await supabase
        .from('Posts')
        .update({
          comments: updatedComments
        })
        .eq('id', id)
        .select()
      setCurrentComments(updatedComments) // adds new comment to the UI
    } catch (error) {
      console.log('Error: ', error)
    }
    toast({
      description: "Your comment has been sent.",
    })
    setComment('')

  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error} = await supabase
          .from('Posts')
          .select()
          .eq('id', id)
          console.log(data);
        setPost(data[0])
        setLikes(data[0].likes)
        setCurrentComments(data[0].comments)
      } catch (error) {
        console.log('Error: ', error.message)
      }
    }
    fetchPost()
    
  }, [])

  return (
    <div className=" border-[6px] rounded-3xl border-[#111113] flex flex-col justify-center items-center mx-48">
      <div className='flex justify-between'>
        <div>
          <p>Posted {new Date(post.created_at).toLocaleDateString("en-US")}</p>
        </div>
        <div className='flex'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.22 2H11.78C11.2496 2 10.7409 2.21071 10.3658 2.58579C9.99072 2.96086 9.78 3.46957 9.78 4V4.18C9.77964 4.53073 9.68706 4.87519 9.51154 5.17884C9.33602 5.48248 9.08374 5.73464 8.78 5.91L8.35 6.16C8.04596 6.33554 7.70108 6.42795 7.35 6.42795C6.99893 6.42795 6.65404 6.33554 6.35 6.16L6.2 6.08C5.74107 5.81526 5.19584 5.74344 4.684 5.88031C4.17217 6.01717 3.73555 6.35154 3.47 6.81L3.25 7.19C2.98526 7.64893 2.91345 8.19416 3.05031 8.706C3.18717 9.21783 3.52154 9.65445 3.98 9.92L4.13 10.02C4.43228 10.1945 4.68362 10.4451 4.85905 10.7468C5.03448 11.0486 5.1279 11.391 5.13 11.74V12.25C5.1314 12.6024 5.03965 12.949 4.86405 13.2545C4.68844 13.5601 4.43521 13.8138 4.13 13.99L3.98 14.08C3.52154 14.3456 3.18717 14.7822 3.05031 15.294C2.91345 15.8058 2.98526 16.3511 3.25 16.81L3.47 17.19C3.73555 17.6485 4.17217 17.9828 4.684 18.1197C5.19584 18.2566 5.74107 18.1847 6.2 17.92L6.35 17.84C6.65404 17.6645 6.99893 17.5721 7.35 17.5721C7.70108 17.5721 8.04596 17.6645 8.35 17.84L8.78 18.09C9.08374 18.2654 9.33602 18.5175 9.51154 18.8212C9.68706 19.1248 9.77964 19.4693 9.78 19.82V20C9.78 20.5304 9.99072 21.0391 10.3658 21.4142C10.7409 21.7893 11.2496 22 11.78 22H12.22C12.7504 22 13.2591 21.7893 13.6342 21.4142C14.0093 21.0391 14.22 20.5304 14.22 20V19.82C14.2204 19.4693 14.3129 19.1248 14.4885 18.8212C14.664 18.5175 14.9163 18.2654 15.22 18.09L15.65 17.84C15.954 17.6645 16.2989 17.5721 16.65 17.5721C17.0011 17.5721 17.346 17.6645 17.65 17.84L17.8 17.92C18.2589 18.1847 18.8042 18.2566 19.316 18.1197C19.8278 17.9828 20.2645 17.6485 20.53 17.19L20.75 16.8C21.0147 16.3411 21.0866 15.7958 20.9497 15.284C20.8128 14.7722 20.4785 14.3356 20.02 14.07L19.87 13.99C19.5648 13.8138 19.3116 13.5601 19.136 13.2545C18.9604 12.949 18.8686 12.6024 18.87 12.25V11.75C18.8686 11.3976 18.9604 11.051 19.136 10.7455C19.3116 10.4399 19.5648 10.1862 19.87 10.01L20.02 9.92C20.4785 9.65445 20.8128 9.21783 20.9497 8.706C21.0866 8.19416 21.0147 7.64893 20.75 7.19L20.53 6.81C20.2645 6.35154 19.8278 6.01717 19.316 5.88031C18.8042 5.74344 18.2589 5.81526 17.8 6.08L17.65 6.16C17.346 6.33554 17.0011 6.42795 16.65 6.42795C16.2989 6.42795 15.954 6.33554 15.65 6.16L15.22 5.91C14.9163 5.73464 14.664 5.48248 14.4885 5.17884C14.3129 4.87519 14.2204 4.53073 14.22 4.18V4C14.22 3.46957 14.0093 2.96086 13.6342 2.58579C13.2591 2.21071 12.7504 2 12.22 2Z" stroke="#0084FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#0084FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H21" stroke="#0095FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" stroke="#0095FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="#0095FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 11V17" stroke="#0095FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 11V17" stroke="#0095FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <h2>{post.title}</h2>
      <div>
        <div className='flex'>
          <p>By </p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" stroke="#0095FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#0095FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>{post.author}</p>
          <button className='flex' onClick={updateLikes}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_17_608)">
                <path d="M5.83337 8.33333V18.3333" stroke="#0095FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.5 4.90001L11.6666 8.33334H16.525C16.7837 8.33334 17.0389 8.39358 17.2703 8.50929C17.5017 8.62501 17.703 8.79301 17.8583 9.00001C18.0135 9.207 18.1185 9.44729 18.1647 9.70186C18.211 9.95643 18.1974 10.2183 18.125 10.4667L16.1833 17.1333C16.0823 17.4795 15.8718 17.7836 15.5833 18C15.2948 18.2164 14.9439 18.3333 14.5833 18.3333H3.33329C2.89127 18.3333 2.46734 18.1577 2.15478 17.8452C1.84222 17.5326 1.66663 17.1087 1.66663 16.6667V10C1.66663 9.55798 1.84222 9.13405 2.15478 8.82149C2.46734 8.50893 2.89127 8.33334 3.33329 8.33334H5.63329C5.94336 8.33317 6.24724 8.24651 6.51076 8.08311C6.77427 7.9197 6.98698 7.68602 7.12496 7.40834L9.99996 1.66667C10.3929 1.67154 10.7797 1.76515 11.1315 1.9405C11.4832 2.11586 11.7907 2.36843 12.0311 2.67934C12.2715 2.99025 12.4386 3.35147 12.5197 3.73601C12.6009 4.12054 12.5942 4.51845 12.5 4.90001Z" stroke="#0095FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_17_608">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <p>{likes} upvotes</p>
          </button>
        </div> 
      </div>
      {/** Todo: Add tags here */}
      <div className='w-[450px]'>
        <AspectRatio ratio={16/9}>
          {isImage ? <img src={post.content} alt={post.title} /> : <video src={post.content} controls />}
        </AspectRatio>
      </div>
      <div className='flex flex-col'>
        <p className={`${isExpanded ? 'whitespace-pre-wrap text-left	' : 'text-left line-clamp-3 overflow-hidden '} `}>{post.description}</p>
        <button className='text-blue-500 hover:underline' onClick={toggleExpanded}>
          {isExpanded ? 'Show less...' : 'Show more...'}
        </button>
      </div>
      {/* Comment section */}
      <div>
        <h3>Comments</h3>
        <div>
          <div className="grid w-full gap-2">
            <Textarea className='text-black' placeholder="Type your comment here." value={comment} onChange={(event) => setComment(event.target.value)}/>
            <Button onClick={insertCommentIntoDatabase}>Comment</Button>
            <Toaster />
          </div>
        </div>
        {
          currentComments?.map((comment, index) => (
            <div key={index} className=''>
              <p>By {comment.author} - {comment.date}</p>
              <p>{comment.content}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default PostPage;