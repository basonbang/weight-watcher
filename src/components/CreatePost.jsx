import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Toaster } from './ui/toaster';
import { Badge } from './ui/badge';

import { supabase } from '@/supabaseClient';

function CreatePost({username}) {

  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [flags, setFlags] = useState([])
  const [clickedBadges, setClickedBadges] = useState({
    Image: false,
    Video: false
  })

  const handleBadgeClick = (badgeName) => {
    setClickedBadges(prevState => ({
      ...prevState,
      [badgeName]: !prevState[badgeName]
    }))
  }

  const updateFlags = (event) => {
    const flag = event.target.innerText;
    handleBadgeClick(flag);
  
    // remove flag if already present, add if not
    if (flags.includes(flag)) {
      setFlags(flags.filter((f) => f !== flag));
    } else {
      setFlags([...flags, flag]);
    }
  }

  const validateAndSetContent = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/mpeg", "video/MOV"];

    // Validate file type
    if (validTypes.includes(file.type)) {
      // Upload file to Supabase storage
      setFileName(file.name);
      const path = `uploads/${file.name}`;  // construct path
      try {
        const { data, error } = await supabase.storage.from('Content').upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
        toast({
          description: "File uploaded.",
        })
      } catch (error){
          console.error('Error uploading file: ', error.message)
          throw error;
      }
      // Get link from storage and set fileContent
      try {
        const { data } = supabase.storage
          .from("Content")
          .getPublicUrl(path);
        console.log(data);
        setFileContent(data.publicUrl);
      } catch (error) {
        console.error('Error getting file link: ', error.message)
        throw error;
      }

    } else {
      alert("Invalid file type. Please select an image or video file.")
    }

  }

  console.log(fileContent);
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Insert post into Supabase
    try {
      const { data, error } = await supabase
        .from('Posts')
        .insert([
          {title: title, author: username, description: description, tags: flags, content: fileContent}
        ])
    } catch (error) {
      console.error('Error creating post: ', error.message)
      alert('Failed to create post.')
    }

    // Clear form
    setTitle('');
    setDescription('');
    setFileContent(null);
    setFileName('');
    toast({
      className: 'bg-green-500 border-none',
      description: "Post created successfully.",
    })
  }

  return (
    <main className="border-[6px] rounded-3xl border-gray-900 mx-56 flex flex-col justify-center items-center ">
      <h1 className="font-bold text-5xl mt-[60px] mb-4 mx-72 w-max">
        Create Your Post
      </h1>
      <div className='justify-center ml-6 mb-4 flex items-center gap-4'>
        <p>Set Your Flags: </p>
        <Badge
          className={`cursor-pointer p-3 ${clickedBadges["Image"] ? 'bg-blue-700' : 'bg-[#0084FF]'} hover:bg-blue-700 transform hover:scale-110 transition-transform`}
          onClick={updateFlags}
        >
          Image
        </Badge>
        <Badge
          className={`cursor-pointer p-3 ${clickedBadges["Video"] ? 'bg-blue-700' : 'bg-[#0084FF]'} hover:bg-blue-700 transform hover:scale-110 transition-transform`}
          onClick={updateFlags}
        >
          Video
        </Badge>
      </div>
      <form
        onSubmit={handleSubmit}
        className='pb-10'
      >
        <div className="grid w-full max-w-sm items-start gap-1.5 mb-4 text-left">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            placeholder="Title"
            className="text-black"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Enter the title of your post
          </p>
        </div>

        <div className="grid w-full gap-1.5 mb-4 text-left">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            placeholder="Type your description here."
            id="description"
            className="text-black"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Enter the description of your post.
          </p>
        </div>

        <div className="grid w-full max-w-sm items-start gap-1.5 cursor-pointer mb-4 text-left relative">
          <Label htmlFor="content">Content (Image or Video)</Label>
          <div className='flex flex-col items-start'>
            <Input
              id="content"
              type="file"
              accept="image/*, video/*"
              className="cursor-pointer mb-1"
              required
              onChange={validateAndSetContent}
            />
            {fileName && (<p className='text-sm font-normal text-muted-foreground'>{fileName}</p>)}
          </div>
        </div>

        <Button type='submit' className="bg-blue-500 hover:bg-blue-700 rounded-md text-white transition duration-200 ease-in-out">
          Create!
        </Button>
        <Toaster />
      </form>
    </main>
  );
}

export default CreatePost;