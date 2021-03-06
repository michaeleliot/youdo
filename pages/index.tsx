import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Trello from '../components/Trello'
import { Typography } from '@material-ui/core'
import React from 'react'
import EditableLabel from 'react-inline-editing';
import prisma from "../lib/prisma"

import { initializeStore } from '../redux/store'
import { getSession, signIn, signOut, useSession } from "next-auth/client";

import { ColumnWithTasks, Task } from '../types'
import { TrelloState } from '../redux/reducers/trello_reducer'


const IndexPage = () => {
  const [session, loading] = useSession();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div>
        <div className={styles.container}>
          <Head>
            <title>YouDo</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Typography variant="h5"> What gets {session.user.name} up in the morning? </Typography>
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
          <Trello />

          <footer className={styles.footer}>
          </footer>
        </div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  } else {
    return (
      <div>
        You are not logged in! <br />
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }
};

export default IndexPage;


export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  let columns = await prisma.column.findMany({
    where: {
      owner: { email: session.user.email },
    },
    orderBy: { position: "asc" },
    include: {
      Task: { orderBy: { position: "asc" } },
    },
  })

  const columnObject: { [key: number]: ColumnWithTasks } = {}
  const taskObject: { [key: number]: Task } = {}
  columns.forEach(column => {
    columnObject[column.id] = {
      ...column,
      Task: column.Task.map(task => task.id),
    }
    column.Task.forEach(task =>
      taskObject[task.id] = task
    )
  })
  let trello: TrelloState = {
    fakeColumnId: -1,
    fakeTaskId: -1,
    pendingActions: [],
    columns: columns.map(column => column.id),
    columnObject,
    taskObject
  }
  const reduxStore = initializeStore({
    trello
  })

  return { props: { initialReduxState: reduxStore.getState() } }
}