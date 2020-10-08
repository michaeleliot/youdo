import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Trello from '../components/Trello'
import taskdata from '../components/taskdata'
import okrdata from '../components/okrdata'
import { TextField, Typography } from '@material-ui/core'
import React from 'react'
import EditableLabel from 'react-inline-editing';
import { useSelector, useDispatch } from 'react-redux'

const useCounter = () => {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  const increment = () =>
    dispatch({
      type: 'INCREMENT_COUNTER',
    })
  const decrement = () =>
    dispatch({
      type: 'DECREMENT_COUNTER',
    })
  return { count, increment, decrement }
}

export default function Main({ items }) {
  const { count, increment, decrement } = useCounter()

  return (
    <div className={styles.container}>
      <Head>
        <title>YouDo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Typography variant="h5"> What gets you up in the morning? </Typography>
      <EditableLabel
        text={"I prove myself everyday so that others can reimagine what is possible."}
        labelClassName='myLabelClass'
        inputClassName='myInputClass'
        inputWidth='100%'
        inputHeight='100%'
        inputMaxLength={50}
        inputMin
        onFocus={(text) => (console.log(text))}
        onFocusOut={(text) => (console.log(text))}
      />
      <Trello initialData={okrdata} />
      <Trello initialData={taskdata} />

      <div>
        <h1>
          Count: <span>{count}</span>
        </h1>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
      </div>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}