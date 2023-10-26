function fetchRepos(event) {
    event.preventDefault(); // prevent form submission

    const username = document.getElementById("username").value;
    const token = document.getElementById("token").value;
    const apiUrl = 'https://api.github.com/users/' + username + '/repos?type=all';

    fetch(apiUrl, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        my_modal_1.showModal();
        displayRepos(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayRepos(repos) {
    const reposContainer = document.getElementById("reposContainer");
    reposContainer.innerHTML = "";

    repos.forEach(repo => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "repo";
        checkbox.value = repo.full_name;

        const label = document.createElement("label");
        label.appendChild(document.createTextNode(repo.full_name));

        reposContainer.appendChild(checkbox);
        reposContainer.appendChild(label);
        reposContainer.appendChild(document.createElement("br"));
    });

    // Show the modal after displaying repositories
    const modal = document.getElementById("reposModal");

    // Create and append the delete button inside the modal
    const deleteButton = document.createElement("button");
    deleteButton.className = "bg-red-500 hover:bg-red-700 text-white my-2 py-2 my-4 mb-5 rounded-sm w-full";
    deleteButton.textContent = "Delete Selected Repositories";
    deleteButton.addEventListener("click", deleteRepos);

    reposContainer.appendChild(deleteButton);
}

function deleteRepos() {
    const token = document.getElementById("token").value;
    const selectedRepos = Array.from(document.querySelectorAll("input[name=repo]:checked")).map(repo => repo.value);

    selectedRepos.forEach(repo => {
        fetch(`https://api.github.com/repos/${repo}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(response => {
            location.reload();
            if (response.ok) {
                console.log(`Repository ${repo} deleted successfully.`);
            } else {
                throw new Error(`Error deleting repository ${repo}. Status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

// Attach the fetchRepos function to the form submission event
document.querySelector('form').addEventListener('submit', fetchRepos);
