import React from 'react';
import { useState } from 'react';

function CreatePost() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">

        </label>
      </form>
    </main>
  );
}

export default CreatePost;