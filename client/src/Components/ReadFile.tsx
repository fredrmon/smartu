import * as XLSX from "xlsx";
import axios from "axios";
import Button from "@mui/material/Button";
import { AnswerOption } from "../Models/QuizAnswer";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { ConfirmWarningDialog } from "./ConfirmWarningDialog";
import { useState } from "react";

export const ReadFile = ({ refreshList, handleCloseFileDialog }: { refreshList: any, handleCloseFileDialog: any } ) => {
  const { id } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const createQuestions = async (
    item: any[],
    itemOption1: AnswerOption[],
    itemOption2: AnswerOption[],
    itemOption3: AnswerOption[],
    itemOption4: AnswerOption[]
  ) => {
    let qId: number;
    let count: number = 0;
    for (let i = 0; i < item.length; i++) {
      let promise = await axios
        .post(`/api/questions`, item[i])
        .then((res) => {
          qId = res.data.insertId;
          count++;
        })
        .then(async () => {
          await uploadQuestionOptions(
            qId,
            count,
            itemOption1,
            itemOption2,
            itemOption3,
            itemOption4
          );
        });
      Promise.resolve(promise).then(() => {
        refreshList();
      });
    }
  };

  const uploadQuestionOptions = async (
    qId: number,
    count: number,
    itemOption1: AnswerOption[],
    itemOption2: AnswerOption[],
    itemOption3: AnswerOption[],
    itemOption4: AnswerOption[]
  ) => {
    if (itemOption1[count - 1].answer.length > 0) {
      await axios.post(`/api/questions/${qId}/answers`, {
        answer: itemOption1[count - 1].answer,
        correctanswer: itemOption1[count - 1].correctanswer,
        questionid: qId,
      });
    }
    if (itemOption2[count - 1].answer.length > 0) {
      await axios.post(`/api/questions/${qId}/answers`, {
        answer: itemOption2[count - 1].answer,
        correctanswer: itemOption2[count - 1].correctanswer,
        questionid: qId,
      });
    }
    if (itemOption3[count - 1].answer.length > 0) {
      await axios.post(`/api/questions/${qId}/answers`, {
        answer: itemOption3[count - 1].answer,
        correctanswer: itemOption3[count - 1].correctanswer,
        questionid: qId,
      });
    }
    if (itemOption4[count - 1].answer.length > 0) {
      await axios.post(`/api/questions/${qId}/answers`, {
        answer: itemOption4[count - 1].answer,
        correctanswer: itemOption4[count - 1].correctanswer,
        questionid: qId,
      });
    }
  };

  const handleFileUpload = (event: any) => {
    handleCloseFileDialog();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt: any | null) => {
      if (evt === null) {
        //do nothing
      } else {
        const bstr: any = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const worksheet = wb.Sheets[wsname];
        const data: any = XLSX.utils.sheet_to_csv(worksheet);
        processData(data);
      }
    };
    reader.readAsBinaryString(file);
  };

  const fileToArray = (text: string): string[] => {
    let re_valid =
      /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    let re_value =
      /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not valid
    if (!re_valid.test(text)) return [""];
    let row: string[] = [];
    text.replace(re_value, function (m0, m1, m2, m3) {
      // Remove backslash from \' and \" in single/double quoted values
      if (m1 !== undefined) row.push(m1.replace(/\\'/g, "'"));
      else if (m2 !== undefined) row.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) row.push(m3);
      return "";
    });
    return row;
  };

  const processData = (dataString: string) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = fileToArray(dataStringLines[0]);
    const questionLength = 3;
    const optionLength = 7;
    const itemList: any = [];
    const option1: AnswerOption[] = [];
    const option2: AnswerOption[] = [];
    const option3: AnswerOption[] = [];
    const option4: AnswerOption[] = [];
    const optionobj1: any = [];
    const optionobj2: any = [];
    const optionobj3: any = [];
    const optionobj4: any = [];
    if (headers !== null) {
      if (headers.length !== 8) {
        handleDialogOpen();
      } else {
        for (let i = 1; i < dataStringLines.length; i++) {
          const row = fileToArray(dataStringLines[i]);
          if (row !== null) {
            if (headers && row.length === headers.length) {
              //processing questions
              const questionobj: any = {};
              for (let j = 0; j < questionLength; j++) {
                let d = row[j];
                if (headers[j]) {
                  questionobj[headers[j]] = d;
                }
              }
              //processing options
              for (let k = questionLength; k < optionLength; k++) {
                let correct = Number(row[7]);
                let d = row[k];
                //option1
                if (k === 3) {
                  if (correct === 1)
                    optionobj1[headers[k]] = { answer: d, correctanswer: 1 };
                  else optionobj1[headers[k]] = { answer: d, correctanswer: 0 };
                }
                //option2
                if (k === 4) {
                  if (correct === 2)
                    optionobj2[headers[k]] = { answer: d, correctanswer: 1 };
                  else optionobj2[headers[k]] = { answer: d, correctanswer: 0 };
                }
                //option3
                if (k === 5) {
                  if (correct === 3)
                    optionobj3[headers[k]] = { answer: d, correctanswer: 1 };
                  else optionobj3[headers[k]] = { answer: d, correctanswer: 0 };
                }
                //option4
                if (k === 6) {
                  if (correct === 4)
                    optionobj4[headers[k]] = { answer: d, correctanswer: 1 };
                  else optionobj4[headers[k]] = { answer: d, correctanswer: 0 };
                }
              }
              // remove the blank rows
              if (Object.values(questionobj).filter((x) => x).length > 0) {
                let obj = {
                  questioncategory: questionobj.questioncategory,
                  questiondifficulty: questionobj.questiondifficulty,
                  questiontheme: questionobj.questiontheme,
                  activityid: id,
                };
                itemList.push(obj);
              }
              if (Object.values(optionobj1).filter((x) => x).length > 0) {
                option1.push(optionobj1.option1);
              }
              if (Object.values(optionobj2).filter((x) => x).length > 0) {
                option2.push(optionobj2.option2);
              }
              if (Object.values(optionobj3).filter((x) => x).length > 0) {
                option3.push(optionobj3.option3);
              }
              if (Object.values(optionobj4).filter((x) => x).length > 0) {
                option4.push(optionobj4.option4);
              }
            }
          }
        }
      }

      if (
        itemList.length > 0 &&
        option1.length > 0 &&
        option2.length > 0 &&
        option3.length > 0 &&
        option4.length > 0
      ) {
        createQuestions(itemList, option1, option2, option3, option4);
      }
    }
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = (confirm: boolean) => {
    setIsDialogOpen(false);
  };

  const Input = styled("input")({
    display: "none",
  });

  return (
    <div>
      <label htmlFor="contained-button-file">
        <Input
          id="contained-button-file"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
        />
        <Button
          variant="contained"
          component="span"
          startIcon={<FileUploadIcon />}
        >
          Upload from file
        </Button>
      </label>
      <ConfirmWarningDialog
        title="Invalid header format"
        body="The length of you header is incorrect. Please use the template."
        isOpen={isDialogOpen}
        handleClose={handleDialogClose}
        confirm={false}
      />
    </div>
  );
};
