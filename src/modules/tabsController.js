import {makeTodayPage} from './pages/todayPage'
import {makeUpcomingPage} from './pages/upcomingPage'
import {makeProjectsPage} from './pages/projectsPage'
import tasksManager from "./tasksManager"


const tabsController = (()=>{
    const tabs = document.querySelectorAll('.tab')
    function setTabToActive (tab) { //set active tab to appropriate styling
        switch (tab.id){
            case 'today':
                tabs[1].classList.remove('active')
                tabs[2].classList.remove('active')
                tabs[0].classList.add('active')
                makeTodayPage()
                break;
            case 'upcoming':
                tabs[0].classList.remove('active')
                tabs[2].classList.remove('active')
                tabs[1].classList.add('active')
                makeUpcomingPage()
                break;
            case 'projects':
                tabs[0].classList.remove('active')
                tabs[1].classList.remove('active')
                tabs[2].classList.add('active')
                makeProjectsPage()
                break;
        }
        updateTabNums()
    }
    
    function updateTabNums () { //updates the tab titles to include # of items for that tab in brackets
        let count
        count = tasksManager.getTasksNumToday()
        if (count > 0) {
            document.querySelector('#today').textContent = `Today (${count})`
        } else {
            document.querySelector('#today').textContent = 'Today'
        }

        count = tasksManager.getTasksNumUpcoming()
        if (count > 0) {
            document.querySelector('#upcoming').textContent = `Upcoming (${count})`
        } else {
            document.querySelector('#upcoming').textContent = 'Upcoming'
        }
        
        count = tasksManager.getProjectsNum()
        if (count > 0) {
            document.querySelector('#projects').textContent = `Projects (${count})`
        } else {
            document.querySelector('#projects').textContent = 'Projects'
        }
    }
    return {setTabToActive}
})()

export default tabsController