import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";

const toTitleCase = (str: string) => {
  return str.replace(/\b\w+/g, (s) => {
    return s.charAt(0).toUpperCase() + s.substring(1).toLocaleLowerCase();
  });
};

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const paths: Array<BreadcrumbItem> = [];
  let skipNext: boolean = false;
  let skipTwice: boolean = false;
  pathnames.forEach((x, i) => {
    let url = `${pathnames.slice(0, i + 1).join("/")}`;
    let title = x.includes("_") ? x.replaceAll("_", " ") : x;
    if (skipNext) {
      skipNext = false;
    } else if (skipTwice) {
      skipTwice = false;
    } else if (x.length === 8) {
      url += "/" + pathnames[i + 1];
      title += " " + pathnames[i + 1];
      skipNext = true;
      paths.push({
        url: url,
        title: title,
      });
    } else if (x.length === 12 && pathnames.length > 1) {
      url += "/" + pathnames[i + 1] + "/" + pathnames[i + 2];
      title = "Edit " + title + " " + pathnames[i + 1];
      skipNext = true;
      skipTwice = true;
      paths.push({
        url: url,
        title: title,
      });
    } else {
      paths.push({
        url: url,
        title: title,
      });
    }
  });

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <CustomLink key={"home"} title={"Home"} url={"/"} />
      {paths.map((path, index) => {
        const last = index === paths.length - 1;
        return last ? (
          <Typography color="text.primary" key={path.url}>
            {toTitleCase(path.title)}
          </Typography>
        ) : (
          <CustomLink key={path.url} title={path.title} url={path.url} />
        );
      })}
    </Breadcrumbs>
  );
};

const CustomLink = ({ title, url }: BreadcrumbItem) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { numberOfStudents } = (location.state as LocationState) || 0;

  const handleNavigate = () => {
    if (url.startsWith("activity"))
      navigate(url, { state: { numberOfStudents: numberOfStudents } });
    else navigate(url);
  };

  return (
    <Typography
      sx={{
        "&:hover": {
          textDecoration: "underline",
          cursor: "pointer",
        },
      }}
      onClick={handleNavigate}
    >
      {toTitleCase(title)}
    </Typography>
  );
};

type LocationState = {
  numberOfStudents: number;
};

interface BreadcrumbItem {
  title: string;
  url: string;
}
