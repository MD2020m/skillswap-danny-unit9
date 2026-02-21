export function filterSkillsByCategory(skills, category) {

    console.log(category);
    const filterResults = category == "All" ? skills : skills.filter(skill => {
        if(skill.category == category) {
            return skill;
        };
    });

    console.log(filterResults.length);
    if (filterResults.length == 0) {
        emptyResults();
    }

    return filterResults;
}

export function emptyResults() {
    console.log('No results match the filter');
}

export function calculateTotalCosts(rate, hrs) {
    return rate * hrs;
}

export function matchSkillsToUser(userNeeds, skills) {
    const { category, maxPrice } = userNeeds;

    const results = skills.filter((skill) => {
        if (skill.price <= maxPrice) {
            if (category != '') {
                if (skill.category == category) {
                    return skill;
                }
            } else {
                return skill;
            }
        }
    });

    return results;
}

/*module.exports = {
    filterSkillsByCategory,
    emptyResults
};*/