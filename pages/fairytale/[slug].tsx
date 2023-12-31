/* eslint-disable @next/next/no-img-element */
import { getAllFairytaleSlugs, getFairytale } from 'lib/sanity.client'
import { iFairytale } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import styles from './FairtalePage.module.css'
interface PageProps {
  fairytale: iFairytale
}

interface Query {
  [key: string]: string
}

const FairtalePage = ({ fairytale }: PageProps) => {
  // destructure the fairytale object
  const { title } = fairytale

  const [storyImage, setStoryImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generateNewStoryImage = async () => {
    // Add code here to generate a new story image based on sanity data, be creative!

    // Use values from the fairytale object to generate a prompt, you might have to get creative here.
    // The prompt should be a string that is passed to the openai-image API.
    // The API will return a text string that you can use to set the storyImage state.
    // The API is not perfect, so you might have to try a few times to get a good result.

    const imagePrompt =
      'Make a cute image with a title of: ${title}, and a description of: ${generateText}'

    try {
      const response = await fetch('/api/openai-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: imagePrompt,
        }),
      }).then((res) => res.json())

      if (response.text) {
        setStoryImage(response.text)
      } else {
        console.log('Error: response text is undefined')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleGenerateImage = async () => {
    setIsLoading(true)
    await generateNewStoryImage()
    setIsLoading(false)
  }

  return (
    <main className="p-10">
      <h1>{title}</h1>
      <button
        className="m-5 rounded-md bg-slate-500 px-2"
        onClick={handleGenerateImage}
      >
        Generate image
      </button>
      {isLoading && <div className={styles.loader}></div>}

      {storyImage && <Image src={storyImage} alt="" width={512} height={512} />}
    </main>
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  // Get the slug from the context
  const { params = {} } = ctx

  // Fetch the fairytale with the given slug
  const [fairytale] = await Promise.all([getFairytale(params.slug)])

  // If no fairytale was found, return 404
  if (!fairytale) {
    return {
      notFound: true,
    }
  }

  // Return the fairytale for Next.js to use
  return {
    props: {
      fairytale,
      // revalidate every two hours
      revalidate: 60 * 60 * 2,
    },
  }
}

export const getStaticPaths = async () => {
  // Fetch all fairytale slugs
  const slugs = await getAllFairytaleSlugs()

  return {
    paths: slugs?.map(({ slug }) => `/fairytale/${slug}`) || [],
    fallback: 'blocking',
  }
}

export default FairtalePage
