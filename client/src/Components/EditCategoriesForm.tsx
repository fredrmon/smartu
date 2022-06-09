import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Button,
  Dialog,
  FormControl,
  FormGroup,
  MenuItem,
  Tab,
  TextField,
} from "@mui/material";
import axios from "axios";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { QuestionCategory } from "../Models/QuestionCategory";

export const EditCategoriesForm = ({ isOpen, handleClose }: any) => {
  const [categories, setCategories] = useState<Array<QuestionCategory>>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>({
    categoryid: 1,
    categoryname: "",
  });
  const [addCategoryTitle, setAddCategoryTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState("1");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/categories`).then((res) => {
      setCategories(res.data);
      setSelectedCategory(res.data[0]);
      setIsLoading(false);
    });
  }, []);

  const submitCategory = (title: string) => {
    axios.post(`/api/categories`, { title }).then((res) => {
      setCategories([
        ...categories,
        { categoryid: res.data.insertId, categoryname: title },
      ]);
      setAddCategoryTitle("");
      setIsSubmitting(false);
    });
  };

  const handleAddCategory = (event: any) => {
    if (
      (event.key === "Enter" || event.type === "click") &&
      addCategoryTitle.length > 0 &&
      addCategoryTitle.length <= 30
    ) {
      setIsSubmitting(true);
      submitCategory(addCategoryTitle);
    }
  };

  const handleCategoryChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const id = parseInt(event.target.value);
    const categoryname =
      categories.find((c) => c.categoryid === id)?.categoryname ?? "";
    setSelectedCategory({
      categoryid: id,
      categoryname: categoryname !== "No category" ? categoryname : "",
    });
  };

  const updateCategory = (event: any) => {
    if (
      (event.key === "Enter" || event.type === "click") &&
      selectedCategory.categoryname.length > 0 &&
      selectedCategory.categoryname.length <= 30 &&
      (selectedCategory.categoryname !== "No category" ||
        selectedCategory.categoryid !== 1)
    ) {
      axios
        .put(`/api/categories/${selectedCategory.categoryid}`, {
          categoryname: selectedCategory.categoryname,
        })
        .then((res) => {
          let tempCat = [...categories];
          let index = tempCat.findIndex(
            (c) => c.categoryid === selectedCategory.categoryid
          );
          tempCat[index].categoryname = selectedCategory.categoryname;
          setCategories(tempCat);
        });
    }
  };

  const handleTabChange = (event: any, value: SetStateAction<string>) => {
    setSelectedTab(value);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Dialog open={isOpen} onClose={handleClose}>
          <div style={{ padding: "20px" }}>
            <TabContext value={selectedTab}>
              <TabList onChange={handleTabChange}>
                <Tab label="Edit" value="1" />
                <Tab label="New" value="2" />
              </TabList>
              <TabPanel value="1">
                <FormControl fullWidth>
                  <FormGroup>
                    <TextField
                      select
                      label="Topic"
                      value={selectedCategory.categoryid}
                      onChange={(event) => handleCategoryChange(event)}
                      helperText="Select topic to edit or delete"
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
                      value={selectedCategory.categoryname}
                      inputProps={{ maxLength: 30, minLength: 1 }}
                      helperText={`Max length 30 characters. ${
                        30 - selectedCategory.categoryname.length
                      } characters left.`}
                      onChange={(e) =>
                        setSelectedCategory({
                          ...selectedCategory,
                          categoryname: e.target.value,
                        })
                      }
                      onKeyPress={(e) => updateCategory(e)}
                    ></TextField>
                    <Button
                      disabled={
                        selectedCategory.categoryname.length <= 0 ||
                        selectedCategory.categoryname === "No topic" ||
                        selectedCategory.categoryid === 1
                      }
                      variant="contained"
                      color="primary"
                      sx={{ margin: "10px 0 auto auto" }}
                      onClick={(e) => updateCategory(e)}
                    >
                      Update topic
                    </Button>
                  </FormGroup>
                </FormControl>
              </TabPanel>
              <TabPanel value="2">
                <FormControl fullWidth>
                  <FormGroup>
                    <TextField
                      variant="outlined"
                      label="New topic title"
                      inputProps={{ maxLength: 30, minLength: 1 }}
                      helperText={`Max length 30 characters. ${
                        30 - addCategoryTitle.length
                      } characters left.`}
                      disabled={isSubmitting}
                      value={addCategoryTitle}
                      onChange={(e) => setAddCategoryTitle(e.target.value)}
                      onKeyPress={(e) => handleAddCategory(e)}
                      autoComplete="false"
                    ></TextField>
                    <Button
                      disabled={addCategoryTitle.length <= 0}
                      variant="contained"
                      color="primary"
                      sx={{ margin: "10px 0 auto auto" }}
                      onClick={(e) => handleAddCategory(e)}
                    >
                      Add topic
                    </Button>
                  </FormGroup>
                </FormControl>
              </TabPanel>
            </TabContext>
          </div>
        </Dialog>
      )}
    </>
  );
};
