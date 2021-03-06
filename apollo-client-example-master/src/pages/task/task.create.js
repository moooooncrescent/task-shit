import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import styled from "styled-components";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

const Form = styled.div`
  padding: 25px;
  width: 300px;

  input {
    width: 100%;
  }
  input[type="checkbox"] {
    width: auto;
  }
`;

const NEW_TASK = gql`
  mutation NewTask($input: TaskInput) {
    addTask(input: $input) {
      id
      title
      description
      executor {
        id
        name
      }
      taskType {
        id
        name
      }
      important
    }
  }
`;

const GET_TYPES = gql`
  query GetTaskTypes($name: String) {
    taskTypes(name: $name) {
      id
      name
    }
  }
`;
const GET_USERS = gql`
  query GetUsers($name: String) {
    users(name: $name) {
      id
      name
    }
  }
`;

const TaskCreatePage = () => {
  let history = useHistory();

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    taskType: null,
    executor: null,
    important: false,
  });

  const [getTaskTypes, { data: taskTypesData }] = useLazyQuery(GET_TYPES);
  const [getUsers, { data: usersData }] = useLazyQuery(GET_USERS);
  const [addTask] = useMutation(NEW_TASK, {
    variables: {
      input: {
        title: newTask.title,
        taskTypeId: newTask.taskType?.value,
        executorId: newTask.executor?.value,
        description: newTask.description,
        important: newTask.important,
      },
    },
  });
  console.log(newTask);
  return (
    <Form>
      <div>
        <label>
          <div>Название задачи</div>
          <input
            type="text"
            value={newTask.title}
            onChange={(event) =>
              setNewTask({ ...newTask, title: event.target.value })
            }
          />
        </label>
      </div>
      <div>
        <label>
          <div>Тип задачи</div>
          <AsyncSelect
            cacheOptions
            defaultOptions
            value={newTask.taskType}
            onChange={(taskType) => {
              setNewTask({
                ...newTask,
                taskType: taskType,
              });
            }}
            loadOptions={(inputValue) =>
              new Promise((resolve) => {
                getTaskTypes({
                  variables: {
                    name: inputValue,
                  },
                });

                const options = taskTypesData.taskTypes.map((taskType) => ({
                  value: taskType.id,
                  label: taskType.name,
                }));
                resolve(options);
              })
            }
          />
        </label>
      </div>
      <div>
        <label>
          <div>Исполнитель</div>
          <AsyncSelect
            cacheOptions
            defaultOptions
            value={newTask.executor}
            onChange={(executor) => {
              setNewTask({
                ...newTask,
                executor: executor,
              });
            }}
            loadOptions={(inputValue) =>
              new Promise((resolve) => {
                getUsers({
                  variables: {
                    name: inputValue,
                  },
                });

                const options = usersData.users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }));
                resolve(options);
              })
            }
          />
        </label>
      </div>
      <div>
        <label>
          <div>Описание</div>
          <input
            type="text"
            value={newTask.description}
            onChange={(event) =>
              setNewTask({ ...newTask, description: event.target.value })
            }
          ></input>
        </label>
      </div>
      <div>
        <label>
          <span>Важное</span>
          <input
            type="checkbox"
            value={newTask.important}
            onChange={(event) =>
              setNewTask({ ...newTask, important: event.target.checked })
            }
          />
        </label>
      </div>
      <button
        onClick={() => {
          addTask()
            .then((newTask) => {
              setNewTask({
                title: "",
                taskType: null,
                executor: null,
                description: "",
                important: null,
              });

              history.push(`/task/${newTask.data.addTask.id}`);
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        Сохранить
      </button>
    </Form>
  );
};

export default TaskCreatePage;
