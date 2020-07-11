import DOMController from "../DOMController"
import tasksManager from "../tasksManager"

function makeProjectsPage () {
    DOMController.clearPage()
    let count = 0
    const projectList = tasksManager.getProjectList()
    for (let i=0; i<projectList.length; i++){
        count++
        DOMController.addProject(projectList[i].getName())
        let taskList = projectList[i].getSortedTaskList()
        for (let j=0; j<taskList.length; j++){
            DOMController.addProjectTask(taskList[j]) 
        }
    }
    if (count === 0){
        DOMController.addEmptyMsg('project')
    }
}

export {makeProjectsPage}