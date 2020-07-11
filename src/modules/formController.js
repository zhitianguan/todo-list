import '../../node_modules/animate.css/animate.css'

const formController = (()=> {

    //cache elements related to input forms
    const darkBG = document.querySelector('#darkenedBackground')
    const projectForm = document.querySelector("form#newProject")
    const projectNameInput = projectForm.querySelector("input#projectName")
    const taskForm = document.querySelector("form#newTask")
    const taskDescriptionInput = taskForm.querySelector("input#description")


    function showProjectForm () {
        darkBG.style.display = 'block';
        projectForm.style.display = 'block';
        projectForm.classList.add('animate__animated', 'animate__fadeInDown')
    }

    function closeProjectForm () {
        darkBG.style.display = 'none';
        projectForm.style.display = 'none';
        projectNameInput.value = ''
        if (projectForm.querySelector('#errorMsg')) 
            projectForm.removeChild(projectForm.querySelector('#errorMsg'))
    }
    
    function showTaskForm () {
        darkBG.style.display = 'block';
        taskForm.style.display= 'block';
        taskForm.classList.add('animate__animated', 'animate__fadeInDown')
    }

    function closeTaskForm () {
        darkBG.style.display = 'none';
        taskForm.style.display = 'none';
        taskDescriptionInput.value = ''
        if (taskForm.querySelector('#errorMsg')) 
            taskForm.removeChild(taskForm.querySelector('#errorMsg'))
    }

    function showMiniForm (e) {
        e.target.parentNode.querySelector('form.miniForm').style.display = 'block'
        e.target.style.display = 'none';
    }

    function closeMiniForm (e) {
        e.target.parentNode.querySelector('.descriptionMini').value = ''
        e.target.parentNode.style.display = 'none'
        e.target.parentNode.parentNode.querySelector('.showMiniFormBtn').style.display = 'block'
    }

    
    return {
        showTaskForm,
        closeTaskForm,
        showProjectForm, 
        closeProjectForm, 
        showMiniForm, 
        closeMiniForm
    }
})()

export default formController
