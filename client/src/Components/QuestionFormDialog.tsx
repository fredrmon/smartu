import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  FormGroup,
  TextField,
  MenuItem,
  DialogActions,
  Button,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { ActivityItem } from "../Models/ActivityItem";
import { QuestionCategory } from "../Models/QuestionCategory";
import { QuizAnswer } from "../Models/QuizAnswer";
import { QuestionFormOption } from "../styles";
import { Colors } from "../constants";

export const QuestionFormDialog = ({
  openForm,
  newQuestion,
  closeForm,
  clickedQuestion,
  activityid,
}: any) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [item, setItem] = useState<ActivityItem>({
    questioncategory: 1,
    questiondifficulty: 1,
    questiontheme: "",
  });
  const [itemOptions, setItemOptions] = useState<Array<QuizAnswer>>([
    { answer: "" },
  ]);
  const [categories, setCategories] = useState<Array<QuestionCategory>>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [correctAnswer, setCorrectAnswer] = useState<number>(1);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [imageURI, setImageURI] = useState(null);
  const [image, setImage] = useState<File>();
  const [loaded, setLoaded] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    let promise = await axios
      .get(`/api/questions/${clickedQuestion}`)
      .then((res) => {
        const data: ActivityItem = res.data[0];
        setSelectedCategory(data.questioncategory);
        setItem(data);
      })
      .then(async () => {
        await axios
          .get(`/api/questions/${clickedQuestion}/answers`)
          .then((res) => {
            setItemOptions(res.data);
            let correctIdx: number =
              res.data.findIndex(
                (el: { correctanswer: number }) => el.correctanswer === 1
              ) + 1;
            setCorrectAnswer(correctIdx);
          });
      })
      .then(async () => {
        await getCategories();
      });
    Promise.resolve(promise);
    setLoaded(true);
    setOpenDialog(true);
  }, [clickedQuestion]);

  const setInitialData = useCallback(async () => {
    let promise = await getCategories();
    Promise.resolve(promise);
    setSelectedCategory(1);
    setItem({
      questioncategory: 1,
      questiondifficulty: 1,
      questiontheme: "",
      activityid: activityid,
    });
    setItemOptions([
      {
        answer: "",
        correctanswer: 0,
      },
      {
        answer: "",
        correctanswer: 0,
      },
    ]);
    setOpenDialog(true);
  }, [activityid]);

  useEffect(() => {
    if (openForm && !newQuestion) fetchData();
    else if (openForm && newQuestion) {
      setInitialData();
    }
  }, [fetchData, newQuestion, openForm, setInitialData]);

  useEffect(() => {
    let optionsFilled = itemOptions.every((option) => {
      return option.answer.length > 0;
    });
    if (item.questiontheme.length > 0 && openDialog && optionsFilled) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [item, itemOptions, openDialog, openForm]);

  const getCategories = async () => {
    const res = await axios.get(`/api/categories`);
    setCategories(res.data);
  };
  const handleClose = () => {
    setOpenDialog(false);
    closeForm(false);
  };

  const handleSubmit = (qData: ActivityItem) => {
    if (newQuestion) {
      createQuestion(qData);
    } else {
      updateQuestion(qData);
    }
    handleClose();
  };

  const submitImage = () => {
    if (image !== undefined) {
      const formData = new FormData();
      formData.append("file", image);
      axios
        .post("/api/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setImageURI(null);
        });
    }
  };

  const createQuestion = async (qData: ActivityItem) => {
    let qId: number;
    let promise = await axios
      .post(`/api/questions`, qData)
      .then((res) => {
        qId = res.data.insertId;
      })
      .then(() => {
        itemOptions.forEach(async (option) => {
          await axios.post(`/api/questions/${qId}/answers`, {
            ...option,
            questionid: qId,
          });
        });
      });
    Promise.resolve(promise);
    submitImage();
  };

  const updateQuestion = (qData: ActivityItem) => {
    const patchQuestion = [
      axios.put(`/api/questions/${qData.questionid}`, {
        questioncategory: qData.questioncategory,
        questiondifficulty: qData.questiondifficulty,
        questiontheme: qData.questiontheme,
        image: qData.image,
      }),
    ];
    itemOptions.forEach((option) => {
      patchQuestion.push(
        axios.put(
          `/api/questions/${qData.questionid}/answers/${option.answerid}`,
          {
            answer: option.answer,
            correctanswer: option.correctanswer,
          }
        )
      );
    });
    Promise.all(patchQuestion).then((res) => {
      let checkStatuses = res.find((r) => r.status !== 200);
      if (checkStatuses !== undefined) {
        console.log("Error");
      }
    });
    submitImage();
  };

  const handleItemOptionChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    idx: number
  ) => {
    let options = [...itemOptions];
    options[idx] = { ...options[idx], answer: event.target.value };
    setItemOptions(options);
  };

  const handleCategoryChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setSelectedCategory(parseInt(event.target.value));
    setItem({ ...item, questioncategory: parseInt(event.target.value) });
  };

  const handleCorrectAnswerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCorrectAnswer(parseInt((event.target as HTMLInputElement).value));
    let tempOptions = [...itemOptions];
    tempOptions.forEach((opt) => (opt.correctanswer = 0));
    let index = parseInt(event.target.labels![0].id) ?? 0;
    tempOptions[index].correctanswer = 1;
    setItemOptions(tempOptions);
  };

  const addItemOption = () => {
    const newItem: QuizAnswer = { answer: "", correctanswer: 0 };
    setItemOptions([...itemOptions, newItem]);
  };

  const handleDeleteItemOption = (index: number) => {
    let newOptions = [...itemOptions];
    newOptions.splice(index, 1);
    setItemOptions(newOptions);
  };

  const handleChangeItemDifficulty = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setItem({ ...item, questiondifficulty: parseInt(event.target.value) });
  };

  const handleImageUpload = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        setImageURI(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
      setImage(event.target.files[0]);
      setItem({ ...item, image: event.target.files[0].name });
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        open={openDialog}
        onClose={handleClose}
        sx={{ m: 2, p: 2 }}
      >
        <DialogTitle>
          {newQuestion ? "Add question" : "Edit Question"}
          <Tooltip title="Edit question, question options, set the correct answer, or select a topic.">
            <IconButton>
              <HelpOutlineIcon color="primary"></HelpOutlineIcon>
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit questions, change answer options, change correct answer etc.
          </DialogContentText>
          {item.image !== null && item.image !== undefined && loaded ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={`/api/image/${item.image}`}
                style={{
                  margin: "3px auto",
                  maxHeight: "400px",
                  maxWidth: "100%",
                }}
                alt=""
              />
            </div>
          ) : (
            ""
          )}
          <FormControl fullWidth>
            <FormGroup>
              <TextField
                variant="outlined"
                label="Question"
                required
                placeholder="Write the question here"
                multiline={true}
                rows={3}
                margin="dense"
                fullWidth={true}
                value={item.questiontheme}
                sx={{ marginBottom: "20px" }}
                onChange={(event) =>
                  setItem({
                    ...item,
                    questiontheme: event.target.value,
                  })
                }
              ></TextField>

              {imageURI !== null && imageURI !== undefined ? (
                <div
                  style={{
                    backgroundColor: Colors.background,
                    width: "100%",
                    height: "100px",
                    padding: "2px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <img
                    id="img-preview"
                    src={imageURI}
                    alt="preview"
                    style={{
                      maxWidth: "90%",
                      maxHeight: "90%",
                      margin: "5px",
                      borderRadius: "6px",
                    }}
                  />
                  <Tooltip title="Remove image">
                    <IconButton
                      onClick={() => {
                        setImageURI(null);
                        setImage(undefined);
                        setItem({ ...item, image: undefined });
                        (
                          document.getElementById(
                            "img-preview"
                          ) as HTMLInputElement
                        ).value = "";
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              ) : (
                ""
              )}
              <TextField
                type="file"
                inputProps={{
                  accept: "image/jpg, image/jpeg, image/png",
                  multiple: false,
                }}
                helperText="(Optional) Upload an image"
                sx={{ margin: "10px auto 10px 0" }}
                onChange={handleImageUpload}
              />
              <RadioGroup
                value={correctAnswer}
                onChange={(event) => handleCorrectAnswerChange(event)}
                sx={{ marginBottom: "10px" }}
              >
                <p style={{ textAlign: "right", margin: 0 }}>Set correct</p>
                {itemOptions.map((option, idx) => {
                  return (
                    <QuestionFormOption key={"option-" + idx}>
                      <TextField
                        variant="outlined"
                        label={"Option " + (idx + 1)}
                        margin="dense"
                        required
                        value={option.answer}
                        multiline={true}
                        rows={2}
                        onChange={(event) => handleItemOptionChange(event, idx)}
                        sx={{ width: "70%" }}
                      ></TextField>
                      <Tooltip title="Delete answer option">
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteItemOption(idx)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Set as correct answer">
                        <FormControlLabel
                          id={`${idx}`}
                          value={idx + 1}
                          label=""
                          control={<Radio />}
                        ></FormControlLabel>
                      </Tooltip>
                    </QuestionFormOption>
                  );
                })}
              </RadioGroup>
              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={addItemOption}
                sx={{ marginBottom: "30px" }}
              >
                Add option
              </Button>
              <TextField
                id="outlined-select-category"
                select
                label="Topic"
                value={selectedCategory}
                margin="dense"
                onChange={(event) => handleCategoryChange(event)}
                helperText="Select a topic for the question"
              >
                {categories.map((category, idx) => {
                  return (
                    <MenuItem
                      key={"category-" + idx}
                      value={category.categoryid}
                    >
                      {category.categoryname}
                    </MenuItem>
                  );
                })}
              </TextField>

              <TextField
                select
                label="Difficulty"
                value={item.questiondifficulty}
                margin="dense"
                onChange={(event) => handleChangeItemDifficulty(event)}
                helperText="Select a difficulty rating for the question"
              >
                <MenuItem value={1}>Easy</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>Hard</MenuItem>
              </TextField>
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => handleSubmit(item)}
            disabled={!canSubmit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
