export default class Task{
    constructor(taskId, taskName, assignedTo, taskHourlyRate, taskDescription, taskStartDateTime, taksEndDateTime, taskStatus){
        this.taskId = taskId;
        this.taskName = taskName;
        this.assignedTo = assignedTo;
        this.taskHourlyRate = taskHourlyRate;
        this.taskDescription = taskDescription;
        this.taskStartDateTime = taskStartDateTime;
        this.taksEndDateTime = taksEndDateTime;
        this.taskStatus = taskStatus;
    }
}