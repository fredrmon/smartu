import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ActivityItem } from "../Models/ActivityItem";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { QuestionFormDialog } from "./QuestionFormDialog";
import {
  EditActivityActions,
  FormButtonContainer,
  HelperText,
  TableContainer,
} from "../styles";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ReadFile } from "./ReadFile";
import { DownloadFile } from "./DownloadFile";
import { EditCategoriesForm } from "./EditCategoriesForm";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Tooltip,
  ButtonGroup,
} from "@mui/material";
import { ActivityService as Service } from "../Services/activity.service";

type EditQuestionProps = {
  mode: "edit" | "create";
};

type LocationState = {
  numberOfStudents: number;
};

export const EditQuestions = ({ mode }: EditQuestionProps) => {
  const [items, setItems] = useState<Array<ActivityItem>>([]);
  const [clickedRow, setClickedRow] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openQuestionForm, setOpenQuestionForm] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState<boolean>(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] =
    useState<boolean>(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState(false);
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [pageSize, setPageSize] = useState(10);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { numberOfStudents } = location.state as LocationState;

  useEffect(() => {
    let list: Array<ActivityItem> = [];
    axios
      .get(`/api/activities/${id}/users`)
      .then((res) => {
        const data: number[] = res.data;
        if (data.length < 1) {
          setColumns([
            {
              field: "questionid",
              headerName: "ID",
              width: 50,
              align: "center",
            },
            { field: "questiontheme", headerName: "Question", width: 600 },
            {
              field: "questiondifficulty",
              headerName: "Difficulty",
              width: 150,
              align: "center",
            },
          ]);
        } else {
          setColumns([
            {
              field: "questionid",
              headerName: "ID",
              width: 50,
              align: "center",
            },
            { field: "questiontheme", headerName: "Question", width: 300 },
            {
              field: "categoryname",
              headerName: "Topic",
              description: "The topic of the question",
              width: 150,
            },
            {
              field: "questiondifficulty",
              headerName: "Difficulty",
              description:
                "Question difficulty. 1 is easy, 2 is medium and 3 is hard",
              width: 150,
              align: "center",
            },
            {
              field: "correct_responses",
              headerName: "Correct answers",
              description: "Number of correct answers",
              width: 150,
              align: "center",
            },
            {
              field: "wrong_responses",
              headerName: "Wrong answers",
              description: "Number of wrong answers",
              width: 150,
              align: "center",
            },
            {
              field: "effort",
              headerName: "Effort",
              description:
                "Effort put into tasks. If a student spent more time than the effort-threshold for the question",
              width: 150,
              align: "center",
            },
            {
              field: "performance",
              headerName: "Performance",
              description:
                "Number of correct answers divided by the total number of questions answered",
              width: 150,
              align: "center",
            },
            {
              field: "avg_time",
              headerName: "Average response time",
              description:
                "Average time the students have spent on answering the question",
              width: 200,
              align: "center",
            },
          ]);
        }
      })
      .then(() => {
        axios.get(`/api/activities/${id}/questions`).then((res) => {
          list = res.data;
        });
      })
      .then(() => {
        axios
          .get(
            `/api/activities/${id}/statistics/questions_longest_avg_response_time`
          )
          .then((res) => {
            res.data.forEach(
              (el: { questionid: number; average_response_time: number }) => {
                let time: string = Service.convertToMinutesAndSeconds(
                  el.average_response_time
                );
                list.forEach((item) => {
                  if (item.questionid === el.questionid) {
                    item.avg_time = time;
                  }
                });
              }
            );
            setItems(list);
            setIsLoading(false);
          });
      });
  }, [id, isLoading]);

  const handleRowClicked = (row: any) => {
    setClickedRow(row.row.questionid);
    setOpenQuestionForm(true);
  };

  const handleSelectedChange = (selected: GridSelectionModel) => {
    setSelectedRows(selected);
  };

  const handleAddNewQuestion = () => {
    setNewQuestion(true);
    setOpenQuestionForm(true);
  };

  const handleDelete = async () => {
    const promises: any[] = [];
    selectedRows.forEach((id) => {
      promises.push(axios.delete(`/api/questions/${id}`));
    });
    Promise.all(promises).then((res) => {
      let checkStatuses = res.find((r) => r.status !== 200);
      if (checkStatuses !== undefined) {
        console.log("Error");
      } else {
        setIsLoading(true);
      }
    });
  };

  const handleBack = () => {
    navigate(`/activity/${id}/edit_description`, {
      state: { numberOfStudents: numberOfStudents },
    });
  };

  const handleGoToActivity = () => {
    navigate(`/activity/${id}/`, {
      state: { numberOfStudents: numberOfStudents },
    });
  };

  const handleConfirmDeleteDialogOpen = () => {
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDeleteDialogClose = (
    deleteResource: "delete" | "cancel"
  ) => {
    if (deleteResource === "delete") handleDelete();
    setIsConfirmDeleteDialogOpen(false);
  };

  const refreshList = () => {
    setIsLoading(true);
  };

  const hideFileDialog = () => {
    setIsFileDialogOpen(false);
  };

  const handleOpenCategoryDialog = () => {
    setIsCategoryDialogOpen(true);
  };

  const handleCloseCategoryDialog = () => {
    setIsCategoryDialogOpen(false);
  };

  const handleUploadFileDialog = () => {
    setIsFileDialogOpen(true);
  };

  const handleCloseFileDialog = () => {
    setIsFileDialogOpen(false);
  };

  const FileDialog = ({ isOpen, handleClose, refreshList }: any) => {
    return (
      <Dialog fullWidth open={isOpen} onClose={handleClose}>
        <DialogTitle>Upload questions from file</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can upload files with .csv, .xlsx or .xlx extension. You can
            also download a template with the desired format to get you started
            on making your own question file.
          </DialogContentText>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "end",
              columnGap: "10px",
            }}
          >
            <ReadFile
              refreshList={refreshList}
              handleCloseFileDialog={handleCloseFileDialog}
            />
            <DownloadFile />
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <HelperText>
          {items.length > 0 ? "Double click a question to edit" : ""}
        </HelperText>
        <EditActivityActions>
          <ButtonGroup variant="outlined">
            <Tooltip title="Manage topics">
              <Button
                startIcon={<CategoryIcon />}
                onClick={handleOpenCategoryDialog}
              >
                Topics
              </Button>
            </Tooltip>
            <Tooltip title="Upload questions from file">
              <Button
                startIcon={<FileUploadIcon />}
                onClick={handleUploadFileDialog}
              >
                Upload
              </Button>
            </Tooltip>
            <Tooltip title="Add a new question">
              <Button startIcon={<AddIcon />} onClick={handleAddNewQuestion}>
                Add
              </Button>
            </Tooltip>

            {/* Conditional rendering since Tooltip cant handle disabled buttons */}
            {selectedRows.length === 0 ? (
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleConfirmDeleteDialogOpen}
                disabled
              >
                Delete
              </Button>
            ) : (
              <Tooltip title="Delete selected questions">
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleConfirmDeleteDialogOpen}
                >
                  Delete
                </Button>
              </Tooltip>
            )}
          </ButtonGroup>
        </EditActivityActions>
      </div>

      <TableContainer>
        <QuestionFormDialog
          openForm={openQuestionForm}
          newQuestion={newQuestion}
          closeForm={() => {
            setOpenQuestionForm(false);
            setNewQuestion(false);
            setIsLoading(true);
          }}
          clickedQuestion={clickedRow}
          activityid={id}
        />
        {items.length > 0 ? (
          <DataGrid
            rows={items}
            columns={columns}
            autoHeight={true}
            pagination
            pageSize={pageSize}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageSizeChange={(newPage) => setPageSize(newPage)}
            loading={isLoading}
            getRowId={(row) => row.questionid}
            checkboxSelection
            onRowDoubleClick={(row) => handleRowClicked(row)}
            onSelectionModelChange={(event) => handleSelectedChange(event)}
            sx={{
              ".MuiDataGrid-main, .MuiDataGrid-footerContainer": {
                backgroundColor: "white",
              },
            }}
          />
        ) : (
          <div>
            There are no questions in this activity yet. They will be displayed
            here once there are any. Click on the "New question" button or
            upload questions from a file to get started.
          </div>
        )}
      </TableContainer>
      <FormButtonContainer style={{ margin: "1vh 10vw 1vh auto" }}>
        {mode === "create" ? (
          <Button variant="contained" onClick={handleBack}>
            Back
          </Button>
        ) : (
          ""
        )}
        <Button variant="contained" onClick={handleGoToActivity}>
          To activity dashboard
        </Button>
      </FormButtonContainer>
      <ConfirmDeleteDialog
        title="Are you sure you want to delete this question?"
        body="Deleting this question can not be undone. If you need to change it you can choose the edit option instead."
        isOpen={isConfirmDeleteDialogOpen}
        handleClose={handleConfirmDeleteDialogClose}
      />
      <EditCategoriesForm
        isOpen={isCategoryDialogOpen}
        handleClose={handleCloseCategoryDialog}
      />
      <FileDialog
        isOpen={isFileDialogOpen}
        handleClose={handleCloseFileDialog}
        refreshList={refreshList}
      />
    </>
  );
};
