const express = require("express");

const app = express();

app.use(express.json());

let projects = [];
let counter = 0;

function checkProjectInArray(req, res, next) {
  const { id } = req.params;
  const project = projects.find(el => el.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  req.project = project;

  return next();
}

function countReq(req, res, next) {
  counter++;
  console.log(`Foram realizadas: ${counter} requisições bem sucedidas à esta API`);
  return next();
}

app.post("/projects", countReq, (req, res) => {
  const { id, title } = req.body;
  const project = projects.find(el => el.id == id);

  if (!project) {
    projects.push({ id, title, tasks: [] });
  }

  return res.json(projects);
});

app.post("/projects/:id/tasks", checkProjectInArray, countReq, (req, res) => {
  const { title } = req.body;
  const { project } = req;

  if (!project.tasks.includes(title)) {
    project.tasks.push(title);
  }

  return res.json(projects);
});

app.get("/projects", countReq, (req, res) => {
  return res.json(projects);
});

app.put("/projects/:id", checkProjectInArray, countReq, (req, res) => {
  const { title } = req.body;
  const { project } = req;

  project.title = title;

  return res.json(projects);
});

app.delete("/projects/:id", checkProjectInArray, countReq, (req, res) => {
  const { project } = req;

  projects.splice(project);

  return res.json(projects);
});

app.listen(3000);
