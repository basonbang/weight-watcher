import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { TailSpin } from 'react-loading-icons';

const Home = () => {

  const isInitialMount = useRef(true);
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [orderBy, setOrderBy] = useState('');

  console.log(orderBy);
  
  // read all posts from Supabase as soon as the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('Posts')
          .select()
        setPosts(data)
      } catch (error) {
        console.log('Error: ', error.message)
      }
    }
    fetchPosts()
    setIsLoading(false)
  }, [])

  // update home page once orderBy state changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const updateHomePage = async () => {
        setIsLoading(true)
        try {
          const { data, error} = await supabase
            .from('Posts')
            .select()
            .order(orderBy, {ascending: false})
          setPosts(data)
          setIsLoading(false)
        } catch (error) {
          console.log('Error: ', error.message)
        }
      }

      updateHomePage()
    }

  }, [orderBy])

  console.log(posts);
  return (
    <div className="px-12">
      <div className="border-[3px] rounded-3xl border-gray-900 flex justify-between items-center mb-7 p-7">
        <div className="w-full flex items-center justify-between ">
          <div className="ml-6 flex items-center gap-4">
            Sort by:
            <Badge
              className="bg-[#0084FF] hover:bg-blue-700 cursor-pointer p-3"
              onClick={() => setOrderBy("created_at")}
            >
              Newest
            </Badge>
            <Badge
              className="bg-[#0084FF] hover:bg-blue-700 cursor-pointer p-3"
              onClick={() => setOrderBy("likes")}
            >
              Most Popular
            </Badge>
          </div>
          <div className="mr-6">Filter by:</div>
        </div>
      </div>
      <div className="mx-auto border-[6px] rounded-3xl border-[#111113] flex flex-col justify-center items-center ">
        {isLoading ? (
          <TailSpin />
        ) : (
          <div className="my-4 mx-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                className="border-2 border-gray-900 rounded-md p-2 bg-[#101012] flex flex-col h-full"
                to={`/${post.id}`}
              >
                <div className="w-full h-auto">
                  <svg
                    viewBox="0 0 363 219"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M219.312 18.25H90.75C82.7272 18.25 75.033 20.1728 69.36 23.5953C63.687 27.0178 60.5 31.6598 60.5 36.5V182.5C60.5 187.34 63.687 191.982 69.36 195.405C75.033 198.827 82.7272 200.75 90.75 200.75H272.25C280.273 200.75 287.967 198.827 293.64 195.405C299.313 191.982 302.5 187.34 302.5 182.5V68.4375L219.312 18.25Z"
                      stroke="#F2F0E8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M211.75 18.25V73H302.5"
                      stroke="#F2F0E8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M151.25 100.375L226.875 127.75L151.25 155.125V100.375Z"
                      stroke="#F2F0E8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="bg-[#09090B] flex-grow px-1 py-2 rounded-xl flex flex-col justify-around">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-semibold text-base text-left">
                      {post.title}
                    </h2>
                    <p className="font-medium text-base">
                      {new Date(post.created_at).toLocaleDateString("en-US")}
                    </p>
                  </div>

                  <p className="font-medium text-sm text-left">
                    Posted by:&nbsp;
                    <span className="bg-gradient-to-r from-sky-400 to-blue-400 text-transparent bg-clip-text">
                      {post.author}
                    </span>
                  </p>
                  <div className="flex mt-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_14_158)">
                        <path
                          d="M5.83331 8.33334V18.3333"
                          stroke="#0095FF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.5 4.9L11.6667 8.33333H16.525C16.7838 8.33333 17.0389 8.39357 17.2704 8.50929C17.5018 8.625 17.7031 8.793 17.8584 9C18.0136 9.20699 18.1185 9.44729 18.1648 9.70185C18.2111 9.95642 18.1975 10.2183 18.125 10.4667L16.1834 17.1333C16.0824 17.4795 15.8718 17.7836 15.5834 18C15.2949 18.2164 14.944 18.3333 14.5834 18.3333H3.33335C2.89133 18.3333 2.4674 18.1577 2.15484 17.8452C1.84228 17.5326 1.66669 17.1087 1.66669 16.6667V10C1.66669 9.55797 1.84228 9.13405 2.15484 8.82149C2.4674 8.50893 2.89133 8.33333 3.33335 8.33333H5.63335C5.94342 8.33317 6.2473 8.24651 6.51082 8.0831C6.77433 7.91969 6.98704 7.68601 7.12502 7.40833L10 1.66666C10.393 1.67153 10.7798 1.76514 11.1315 1.94049C11.4832 2.11585 11.7908 2.36842 12.0312 2.67933C12.2716 2.99025 12.4386 3.35146 12.5198 3.736C12.601 4.12053 12.5942 4.51844 12.5 4.9Z"
                          stroke="#0095FF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_14_158">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p className="font-medium text-sm ml-2">
                      {post.likes} upvotes
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;