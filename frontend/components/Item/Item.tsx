import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import Grow from "@material-ui/core/Grow"; //annimate show hide
import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GET_TODOS } from "../Items/Items";
import Edit from "@material-ui/icons/Edit";
import DeleteTodo from "../DeleteTodo/DeleteTodo";
import DoneIcon from "@material-ui/icons/Done";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import clsx from "clsx";
import ButtonBase from "@material-ui/core/ButtonBase";

export const UPDATE_TODO = gql`
  mutation UPDATE_TODO(
    $id: String!
    $title: String
    $image: String
    $done: Boolean!
    $description: String # $date: DateTime
  ) {
    updateToDo(
      id: $id
      title: $title
      image: $image
      done: $done
      description: $description # date: $date
    ) {
      id
      title
      image
      done
      description
      # date
    }
  }
`;

const GET_SINGLE_TODO = gql`
  query GET_SINGLE_TODO($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      image
      done
      description
      # date
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      // justifyContent: "center",
      // flexDirection: "column",
      "&:after": {
        content: " ",
        position: "absolute",
        borderBottom: `${theme.spacing(0.5)} solid ${theme.palette.text}`
      },
      "& > *s": {
        margin: theme.spacing(1)
      }
    },
    content: {
      flex: 1
    },
    done: {
      textDecoration: props => (props.done ? "line-through" : "none")
    },
    image: {
      position: "relative",
      height: 44,
      padding: "6px"
      // borderRadius: "10%"
      // border: `2px solid ${theme.palette.primary.light}`
    },
    imageSrc: {
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
      width: "38px",
      height: "38px",

      // border: `1px solid ${theme.palette.text.primary}`,
      borderRadius: "10%"
    }
  })
);

const Item = ({ itemData, setModalData, handleShowModal }) => {
  const [updateTodo, { data, loading, error }] = useMutation(UPDATE_TODO);
  // const [showLargeI];
  const classes = useStyles(itemData);

  return (
    <div className={classes.root}>
      <IconButton
        aria-label="check"
        // className={classes.margin}
        onClick={() => {
          updateTodo({
            //TODO: add optimistic update
            variables: { id: itemData.id, done: !itemData.done },
            refetchQueries: [
              {
                query: GET_TODOS
              }
            ]
          });
        }}
      >
        {itemData.done ? (
          <DoneIcon fontSize="small" />
        ) : (
          <RadioButtonUncheckedIcon fontSize="small" />
        )}
      </IconButton>
      <div className={clsx(classes.content, classes.done)}>
        <Box fontWeight="fontWeightBold">{itemData.title}</Box>
        <Box>{itemData.description}</Box>
      </div>
      <ButtonBase focusRipple key={itemData.title} className={classes.image}>
        <span
          className={classes.imageSrc}
          style={{
            backgroundImage: `url(${itemData.image})`
          }}
        />
      </ButtonBase>
      <Tooltip title="Edit item" aria-label="menu">
        <IconButton
          aria-label="delete"
          className={classes.margin}
          onClick={() => {
            setModalData({
              ...itemData
            });
            handleShowModal(true);
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <DeleteTodo id={itemData.id} />
    </div>
  );
};

export default Item;
