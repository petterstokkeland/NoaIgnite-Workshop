import { BlockContentIcon } from '@sanity/icons'
import { Button, Card, Flex, Label, Spinner, Text, TextArea } from '@sanity/ui'
import { useState } from 'react'
import { set, StringInputProps, unset } from 'sanity'

// const maxLength = 200

const OpenAISanity = (props: StringInputProps) => {
  // The onChange function is used to update the value of the field
  const { value, onChange } = props
  const [isLoading, setIsLoading] = useState(false)
  const [promt, setPromt] = useState('')

  const callApi = async () => {
    /**
     * write code to fetch data from '/api/openai'
     * and then feed the response text to onChange function
     * to display the generated text
     *
     * Hints:
     * 1. use Post method
     * 2. the body will contain prompt
     * 3. response will have text value
     * 4. Use the two function imported from sanity to set the data if response is successful
     *
     *
     * BONUS
     * 4. Error handling
     * 5. You can set a loading icon while response is being generated by using isLoading usestate
     */
    /**
     * See code example on landing page
     */
    setIsLoading(true)
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promt,
        maxTokens: 100,
      }),
    }).then((res) => res.json())
    console.log(response)
    if (response.text) {
      onChange(response.text ? set(response.text) : unset())
    } else {
      console.log('error')
    }
    setIsLoading(false)
    alert('You need to implement this function')
  }

  const generateStory = async () => {
    // Here you can call the function callApi() you just wrote and handle some errors
    if (!promt) return
    try {
      callApi()
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <Card>
      {isLoading && <Spinner />}

      <Card>
        <TextArea
          onChange={(event) => setPromt(event.currentTarget.value)}
          padding={4}
          placeholder="Once upon a time... "
          value={promt}
          // maxLength={maxLength}
        />
        {/* <Flex justify="flex-end" padding={1}>
          <Label>
            {promt.length}/{maxLength}
          </Label>
        </Flex> */}
      </Card>
      <Flex
        align="baseline"
        justify="space-between"
        paddingBottom={4}
        paddingTop={4}
      >
        <Button
          onClick={generateStory}
          icon={BlockContentIcon}
          text="Generate"
          type="button"
          tone="primary"
          padding={[3, 3, 4]}
          disabled={isLoading}
        />
      </Flex>
      <Card paddingTop={4}>
        <Card paddingBottom={4}>
          <Label>AI Response: {value?.length && null} characters</Label>
        </Card>
        <Text>{value}</Text>
        <Flex justify="flex-end" padding={1}></Flex>
      </Card>
    </Card>
  )
}

export default OpenAISanity
