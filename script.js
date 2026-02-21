import { filterSkillsByCategory, emptyResults, calculateTotalCosts, matchSkillsToUser } from "./skillswap.js";
import { fetchSkills, createSkill } from './api-service.js';
/*let skills = [
    {
        title: 'Web Development',
        description: 'Web development tutoring. Offering help understanding and implementing HTML, CSS, and JavaScript',
        name: 'Danny Marshall',
        price: 25,
        category: 'Computer Science'
    },
    {
        title: 'Programming Practicum',
        description: 'Offering tutoring to help you understand programming best practices and concepts such as loop based vs. functional programming, control structures, and object-oriented programming',
        name: 'Danny Marshall',
        price: 25,
        category: 'Computer Science'
    },
    {
        title: 'Financial Math for Actuarial Exam FM',
        description: `I've pssed FM and you can too. I'm offering help understanding complicated financial math concepts and preparing for SOA Exam FM.`,
        name: 'Danny Marshall',
        price: 30,
        category: 'Mathematics'
    },
    {
        title: 'Probability for Actuarial Exam P',
        description: `I've passed P and you can too. I'm offering tutoring to help you master probability and prepare for SOA Exam P.`,
        name: "Danny Marshall",
        price: 35,
        category: 'Mathematics'
    }
];*/

async function getSkills() {
    const skills = await fetchSkills();

    return skills;
}

const skills = await getSkills();
console.log(skills);

const skillList = document.getElementById('offerings-list');

renderSkills(skills);

const skillCards = document.querySelectorAll('.skill-card');

const fltrBtns = document.querySelectorAll('.fltr-btn');

fltrBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        //console.log(btn.textContent);
        const filteredSkills = filterSkillsByCategory(skills, btn.textContent.trim());
        renderSkills(filteredSkills);
    });
});

const calcBtn = document.getElementById('calc-btn');
calcBtn.addEventListener('click', () => {
    renderCalculation();
});

const matchBtn = document.getElementById('skll-match-btn');
matchBtn.addEventListener('click', () => {
    renderSkillMatch();
});

const postSkillBtn = document.getElementById('skill-creator-submit-btn');
postSkillBtn.addEventListener('click', () => {
    postNewSkill();
})

skillCards.forEach(card => {

    card.addEventListener('mouseover', () => {
        card.style.backgroundColor = 'indigo'; 
    });
    card.addEventListener('mouseout', () => {
        card.style.backgroundColor = '';
    });
});

function renderSkills(skills) {
    skillList.innerHTML = '';
    
    skills.forEach(skill => {
    skillList.innerHTML += `
        <li class="offering-entry">
            <div class="skill-card">
                <h2 class="skl-crd-title">${skill.title}</h2>
                <p class="skl-crd-desc">${skill.description}</p>
                <p class="skl-crd-name">${skill.name}</p>
                <p class="skl-crd-price">$${skill.price}/hr</p>
            </div>
        </li>`;
    });
}

function renderCalculation() {
    const calcDiv = document.getElementById('calc-input-div')

    const calcRateInpt = document.getElementById('calc-rate-inpt');
    //console.log(calcRateInpt);
    //console.log(calcRateInpt.value);
    const calcHrsInpt = document.getElementById('calc-hrs-inpt');
    try{
        const rate = Number(calcRateInpt.value);
        const hrs = Number(calcHrsInpt.value);

        const cost = calculateTotalCosts(rate, hrs);
        //console.log(cost);

        calcDiv.innerHTML = `<div id="calc-input-div">
                <p class="calc-input-label">Hourly Rate: </p>
                <input class="calc-input" id="calc-rate-inpt">
                <p class="calc-input-label">Hours</p>
                <input class="calc-input" id="calc-hrs-inpt">
                <button id="calc-btn">
                    <p class="calc-btn-text">Calculate</p>
                </button>`;

        calcDiv.innerHTML += `<h2 id="calc-result">Total Cost: $${cost}</h2>`;

        const calcBtn = document.getElementById('calc-btn');
        calcBtn.addEventListener('click', () => {
            renderCalculation();
        });
    } catch (err) {
        calcDiv.innerHTML = `<div id="calc-input-div">
                <p class="calc-input-label">Hourly Rate: </p>
                <input class="calc-input" id="calc-rate-inpt">
                <p class="calc-input-label">Hours</p>
                <input class="calc-input" id="calc-hrs-inpt">
                <button id="calc-btn">
                    <p class="calc-btn-text">Calculate</p>
                </button>`;

        calcDiv.innerHTML += `<h2 id='calc-result'>Invalid Input'</h2>
                              <p>Enter numbers in input boxes</p>`;
        const calcBtn = document.getElementById('calc-btn');
        calcBtn.addEventListener('click', () => {
            renderCalculation();
        });                
        //return;
    }
}

function renderSkillMatch() {
    const skillMatchDiv = document.getElementById('skll-matcher-div');
    
    try{
        const skllMatchCatInpt = document.getElementById('skll-match-cat-inpt');
        const category = skllMatchCatInpt.value.trim();

        const skillMatchPriceInpt = document.getElementById('skll-match-price-inpt');
        const maxPrice = Number(skillMatchPriceInpt.value);

        const userNeeds = {
            category: category,
            maxPrice: maxPrice
        };

        const matchedSkills = matchSkillsToUser(userNeeds, skills);
        console.log(matchedSkills);

        
        skillMatchDiv.innerHTML = `<p class="skll-match-inpt-label">Category Preference:</p>
                <input id="skll-match-cat-inpt" value="">
                <p class="skll-match-inpt-label">Max Price:</p>
                <input id="skll-match-price-inpt" value="">
                <button id="skll-match-btn">
                    <p class="skll-match-btn-txt">Match Skills</p>
                </button>`;

        if (matchedSkills.length > 0) {
            skillMatchDiv.innerHTML += `<ul>`

            matchedSkills.forEach(skill => {
                skillMatchDiv.innerHTML += `
                    <li class="offering-entry">
                        <div class="skill-card">
                            <h2 class="skl-crd-title">${skill.title}</h2>
                            <p class="skl-crd-desc">${skill.description}</p>
                            <p class="skl-crd-name">${skill.name}</p>
                            <p class="skl-crd-price">$${skill.price}/hr</p>
                        </div>
                    </li>`;
            });

            skillMatchDiv.innerHTML += `</ul>`
        } else {
            skillMatchDiv.innerHTML += `<p id='no-sklls-match'>Sorry, no results match your search</p>`;
        }

        const matchBtn = document.getElementById('skll-match-btn');
        matchBtn.addEventListener('click', () => {
            renderSkillMatch();
        });

    } catch (err) {
        skillMatchDiv.innerHTML = `<p class="skll-match-inpt-label">Category Preference:</p>
                <input id="skll-match-cat-inpt" value="">
                <p class="skll-match-inpt-label">Max Price:</p>
                <input id="skll-match-price-inpt" value="">
                <button id="skll-match-btn">
                    <p class="skll-match-btn-txt">Match Skills</p>
                </button>`;

        skillMatchDiv.innerHTML += `<p id='invld-skll-match-inpt'>Something went wrong. Please try again later`;
    }
}

async function postNewSkill() {
    const titleInput = document.getElementById('skill-creator-title-input');
    const title = titleInput.value.trim();

    const categoryInput = document.getElementById('skill-creator-category-input');
    const category = categoryInput.value.trim();

    const priceInput = document.getElementById('skill-creator-price-input');
    const price = priceInput.value.trim();

    const descriptionInput = document.getElementById('skill-creator-description-input');
    const description = descriptionInput.value.trim();

    const skillData = {
        title,
        category,
        price,
        description
    };

    await createSkill(skillData);
}