const skills = {
  skill1: { unlocked: true, dependsOn: [] },
  skill2: { unlocked: false, dependsOn: ['skill1'] },
  skill3: { unlocked: false, dependsOn: ['skill1'] },
};

function canUnlock(skillId) {
  return skills[skillId].dependsOn.every(dep => skills[dep].unlocked);
}

function updateUI() {
  Object.keys(skills).forEach(skillId => {
    const el = document.getElementById(skillId);
    if (!el) return;

    if (skills[skillId].unlocked) {
      el.classList.add('unlocked');
      el.classList.remove('locked');
    } else if (canUnlock(skillId)) {
      el.classList.remove('locked');
      el.classList.remove('unlocked');
    } else {
      el.classList.add('locked');
      el.classList.remove('unlocked');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skill').forEach(skillEl => {
    skillEl.addEventListener('click', () => {
      const id = skillEl.id;
      if (!skills[id].unlocked && canUnlock(id)) {
        skills[id].unlocked = true;
        updateUI();
      }
    });
  });

  updateUI();
});
