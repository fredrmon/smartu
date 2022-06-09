import { Button, MenuItem, Select, Link, FormControl } from "@mui/material";
import React, { Fragment } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export const DownloadFile = () => {
  const [fileType, setFileType] = React.useState(1);
  const [file, setFile] = React.useState(
    process.env.PUBLIC_URL + "/templates/Template.csv"
  );

  const handleChange = (event: any) => {
    setFileType(event.target.value);
    if (event.target.value === 1)
      setFile(process.env.PUBLIC_URL + "/templates/Template.csv");
    else if (event.target.value === 2)
      setFile(process.env.PUBLIC_URL + "/templates/Template.xlsx");
    else setFile(process.env.PUBLIC_URL + "/templates/Template.xls");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <>
        <div>Select file format: </div>
        <Fragment>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
            <Select
              labelId="select-label"
              id="select"
              value={fileType}
              label="fileType"
              onChange={handleChange}
            >
              <MenuItem value={1}>.csv</MenuItem>
              <MenuItem value={2}>.xlsx</MenuItem>
              <MenuItem value={3}>.xls</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            href={file}
            component={Link}
            startIcon={<FileDownloadIcon />}
          >
            Download template
          </Button>
        </Fragment>
      </>
    </div>
  );
};
