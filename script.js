const dropdownButton = document.querySelector('.dropdown-btn');
const dropdownMenu = document.getElementById('dropdown1');
const selectedLanguage = document.querySelector('.selected-language');
const dropdownItems = document.querySelectorAll('.dropdown-item');

function toggleDropdown() {
    const isExpanded = dropdownButton.getAttribute('aria-expanded') === 'true';
    dropdownButton.setAttribute('aria-expanded', !isExpanded);
    dropdownMenu.classList.toggle('show');
    if (!isExpanded) {
        dropdownMenu.focus();
    }
}

function closeDropdownOutsideClick(event) {
    if (!dropdownButton.contains(event.target)) {
        dropdownButton.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.remove('show');
    }
}

function updateSelectedLanguage(language) {
    selectedLanguage.textContent = language;
}

dropdownItems.forEach((item, idx) => {
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            dropdown.style.display = 'none';
        } else if (e.key === 'ArrowDown') {
            if (idx < dropdownItems.length - 1) {
                dropdownItems[idx + 1].focus();
            }
        } else if (e.key === 'ArrowUp') {
            if (idx > 0) {
                dropdownItems[idx - 1].focus();
            }
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement === dropdown) {
        dropdown.style.display = 'block';
        dropdownItems[0].focus();
    }
});
function handleLanguageSelection(event) {
    if (event.target.tagName === 'LI') {
        const selectedValue = event.target.getAttribute('data-value');
        updateSelectedLanguage(event.target.textContent);
        dropdownButton.focus();
    }
}

dropdownButton.addEventListener('click', toggleDropdown);
dropdownButton.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
        toggleDropdown();
    }
});

dropdownMenu.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleLanguageSelection(event);
    }
});

    function preventScroll(event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
        }
    }
    
function RadioGroupActiveDescendant(groupNode) {
    this.groupNode = groupNode;
    this.radioButtons = [];
    this.firstRadioButton = null;
    this.lastRadioButton = null;

    this.handleKeydown = function(event) {
        let flag = false;
        let currentItem = this.getCurrentRadioButton();

        switch (event.key) {
            case ' ':
            case 'Enter':
                this.setChecked(currentItem);
                flag = true;
                break;

            case 'Up':
            case 'ArrowUp':
            case 'Left':
            case 'ArrowLeft':
                this.setCheckedToPreviousItem(currentItem);
                flag = true;
                break;

            case 'Down':
            case 'ArrowDown':
            case 'Right':
            case 'ArrowRight':
                this.setCheckedToNextItem(currentItem);
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    };

    this.handleClick = function(event) {
        this.setChecked(event.currentTarget);
    };

    this.handleFocus = function() {
        let currentItem = this.getCurrentRadioButton();
        if (!this.isRadioInView(currentItem)) {
            currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        currentItem.classList.add('focus');
    };

    this.handleBlur = function() {
        let currentItem = this.getCurrentRadioButton();
        currentItem.classList.remove('focus');
    };

    this.isRadioInView = function(radio) {
        let bounding = radio.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <=
            (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    this.setChecked = function(currentItem) {
        for (let i = 0; i < this.radioButtons.length; i++) {
            const rb = this.radioButtons[i];
            rb.setAttribute('aria-checked', 'false');
            rb.classList.remove('focus');
        }
        currentItem.setAttribute('aria-checked', 'true');
        currentItem.classList.add('focus');
        this.groupNode.setAttribute('aria-activedescendant', currentItem.id);
        if (!this.isRadioInView(currentItem)) {
            currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        this.groupNode.focus();
    };

    this.setCheckedToPreviousItem = function(currentItem) {
        let index;

        if (currentItem === this.firstRadioButton) {
            this.setChecked(this.lastRadioButton);
        } else {
            index = this.radioButtons.indexOf(currentItem);
            this.setChecked(this.radioButtons[index - 1]);
        }
    };

    this.setCheckedToNextItem = function(currentItem) {
        let index;

        if (currentItem === this.lastRadioButton) {
            this.setChecked(this.firstRadioButton);
        } else {
            index = this.radioButtons.indexOf(currentItem);
            this.setChecked(this.radioButtons[index + 1]);
        }
    };

    this.getCurrentRadioButton = function() {
        var id = this.groupNode.getAttribute('aria-activedescendant');
        if (!id) {
            this.groupNode.setAttribute(
                'aria-activedescendant',
                this.firstRadioButton.id
            );
            return this.firstRadioButton;
        }
        for (let i = 0; i < this.radioButtons.length; i++) {
            const rb = this.radioButtons[i];
            if (rb.id === id) {
                return rb;
            }
        }
        this.groupNode.setAttribute(
            'aria-activedescendant',
            this.firstRadioButton.id
        );
        return this.firstRadioButton;
    };

    // Initialize
    if (!this.groupNode.getAttribute('role')) {
        this.groupNode.setAttribute('role', 'radiogroup');
    }

    const rbs = this.groupNode.querySelectorAll('[role=radio]');

    for (let i = 0; i < rbs.length; i++) {
        const rb = rbs[i];
        rb.addEventListener('click', this.handleClick.bind(this));
        this.radioButtons.push(rb);
        if (!this.firstRadioButton) {
            this.firstRadioButton = rb;
        }
        this.lastRadioButton = rb;
    }
    this.groupNode.tabIndex = 0;

    this.groupNode.addEventListener('keydown', this.handleKeydown.bind(this));
    this.groupNode.addEventListener('focus', this.handleFocus.bind(this));
    this.groupNode.addEventListener('blur', this.handleBlur.bind(this));
}
window.addEventListener('load', function() {
    const radios = document.querySelectorAll('.radiogroup-activedescendant');
    for (let i = 0; i < radios.length; i++) {
        new RadioGroupActiveDescendant(radios[i]);
    }
});