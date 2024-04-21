import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

import { supabase } from '@/supabaseClient';

function CreatePost() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');

  const validateAndSetContent = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/mpeg", "video/MOV"];

    // Validate file type
    if (validTypes.includes(file.type)) {
      // Upload file to Supabase storage
      setFileName(file.name);
      const path = `uploads/${new Date().getTime()}_${file.name}`;  // construct path
      try {
        const { data, error } = await supabase.storage.from('Content').upload(path, file, {
          cacheControl: '3600',
          upsert: false
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
          {title: title, description: description, content: fileContent}
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
  }

  return (
    <main className="border-[6px] rounded-3xl border-gray-900 mx-56 flex flex-col justify-center items-center ">
      <h1 className="font-bold text-5xl mt-[60px] mb-4 mx-72 w-max">
        Create Your Post
      </h1>
      <p>Set Your Flags: </p>
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
              onChange={validateAndSetContent}
            />
            {fileName && (<p className='text-sm font-normal text-muted-foreground'>{fileName}</p>)}
          </div>
        </div>

        <Button type='submit' className="bg-blue-500 hover:bg-blue-700 rounded-md text-white transition duration-200 ease-in-out">
          Create!
        </Button>
      </form>
    </main>
  );
}

export default CreatePost;