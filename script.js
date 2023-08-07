let mines;
let level;
let bombCount;
let time;
let clickArr = [];
let arrFrags = [];
let cellsCount; // под вопросом
let progress;
let soundOn;
let themeOn;
let lastResult;
let numSteps;
let init;
let seconds = 0;
let minutes = 0;

localStorage.clear;

const loadConfig = () => {
  if (JSON.parse(localStorage.getItem('seconds')) == null) {
    seconds = 0;
  } else {
    seconds = JSON.parse(localStorage.getItem('seconds'));
  }

  if (JSON.parse(localStorage.getItem('minutes')) == null) {
    minutes = 0;
  } else {
    minutes = JSON.parse(localStorage.getItem('minutes'));
  }

  if (localStorage.getItem('level') !== null) {
    level = localStorage.getItem('level');
  } else level = 'easy';

  if (JSON.parse(localStorage.getItem('numSteps') !== null)) {
    numSteps = Number(JSON.parse(localStorage.getItem('numSteps')));
  } else numSteps = 0;

  if (JSON.parse(localStorage.getItem('lastResult')) == null) {
    lastResult = [];
  } else {
    lastResult = JSON.parse(localStorage.getItem('lastResult'));
  }

  if (JSON.parse(localStorage.getItem('bombCount') !== null)) {
    bombCount = JSON.parse(localStorage.getItem('bombCount'));
  } else bombCount = 10;

  if (JSON.parse(localStorage.getItem('time') !== null)) {
    time = JSON.parse(localStorage.getItem('time'));
  } else time = '00:00';

  if (JSON.parse(localStorage.getItem('clickArr')) == null) {
    clickArr = [];
  } else {
    clickArr = JSON.parse(localStorage.getItem('clickArr'));
  }

  if (JSON.parse(localStorage.getItem('arrFrags')) == null) {
    arrFrags = [];
  } else {
    arrFrags = JSON.parse(localStorage.getItem('arrFrags'));
  }

  if (JSON.parse(localStorage.getItem('mines')) == null) {
    mines = [];
  } else {
    mines = JSON.parse(localStorage.getItem('mines'));
  }

  if (JSON.parse(localStorage.getItem('progress') !== null)) {
    progress = Boolean(JSON.parse(localStorage.getItem('progress')));
  } else progress = false;

  if (JSON.parse(localStorage.getItem('soundOn')) !== null) {
    soundOn = Boolean(JSON.parse(localStorage.getItem('soundOn')));
  } else {
    soundOn = true;
  }

  if (JSON.parse(localStorage.getItem('themeOn')) !== null) {
    themeOn = Boolean(JSON.parse(localStorage.getItem('themeOn')));
  } else {
    themeOn = true;
  }
};

loadConfig();

const renderTemplate = () => {
  const app = document.getElementById('app');
  const wrapperApp = document.createElement('div');
  wrapperApp.classList = 'wrapperApp';
  const title = document.createElement('div');
  app.appendChild(wrapperApp);
  title.classList = 'title';
  title.innerHTML = 'Minesweeper';
  wrapperApp.appendChild(title);
  const startGame = document.createElement('button');
  startGame.classList = 'startGame';
  startGame.innerHTML = 'new game';
  wrapperApp.appendChild(startGame);
  const countMines = document.createElement('div');
  countMines.classList = 'count_mines';

  const numberSteps = document.createElement('div');
  numberSteps.classList = 'number_steps';

  const wrapper = document.createElement('div');

  const settingsGame = document.createElement('div');
  settingsGame.classList = 'settings_wrapper';
  settingsGame.innerHTML = `
    <label class="container">easy - 10x10
    <input type="radio" name="radio" checked data-level="easy">
    <span class="checkmark"></span>
    </label>
    <label class="container">medium - 15x15
    <input type="radio" name="radio" data-level="medium">
    <span class="checkmark"></span>
    </label>
    <label class="container">hard - 25x25
    <input type="radio" name="radio" data-level="hard">
    <span class="checkmark"></span>
    </label>`;
  const settingsFlex = document.createElement('div');
  settingsFlex.classList = 'settings_flex';

  wrapper.classList = 'wrapper';
  if (themeOn == false) {
    wrapper.classList.add('black');
  }
  const bombsCount = document.createElement('input');
  const timer = document.createElement('div');
  timer.classList = 'timer';
  const flexTimer = document.createElement('div');
  flexTimer.classList = 'flexTimer';
  bombsCount.setAttribute('type', 'range');
  bombsCount.setAttribute('min', '10');
  bombsCount.setAttribute('max', '99');
  bombsCount.setAttribute('value', `${bombCount}`);
  bombsCount.classList.add('bombsCount');
  const bombsCountValue = document.createElement('div');
  bombsCountValue.classList.add('bombsCountValue');
  wrapperApp.appendChild(settingsGame);
  wrapperApp.appendChild(settingsFlex);
  settingsFlex.appendChild(bombsCount);
  settingsFlex.appendChild(bombsCountValue);
  wrapperApp.appendChild(flexTimer);
  flexTimer.appendChild(countMines);
  flexTimer.appendChild(timer);
  flexTimer.appendChild(numberSteps);
  if (progress) {
    settingsGame.style.display = 'none';
    settingsFlex.style.display = 'none';
    flexTimer.style.display = 'flex';
    startGame.style.display = 'block';
    wrapper.classList.add(level);
  }
  const gameTheme = document.createElement('div');
  gameTheme.innerHTML = `<label class="switch">
    <input type="checkbox">
    <span class="slider round"></span>
    </label>`;

  if (themeOn == false) {
    gameTheme.innerHTML = `<label class="switch">
    <input type="checkbox" checked>
    <span class="slider round"></span>
    </label>`;
  }
  wrapperApp.appendChild(gameTheme);
  wrapperApp.appendChild(wrapper);
  const sound = document.createElement('div');
  sound.classList.add('sound');
  if (soundOn == false) {
    sound.classList.add('soundless');
  }
  wrapperApp.appendChild(sound);
  const lastResultWrapper = document.createElement('div');
  lastResultWrapper.classList.add('lastResultWrapper');
  const resultTable = document.createElement('div');
  resultTable.classList.add('resultTable');
  const titleResult = document.createElement('div');
  titleResult.classList.add('titleResult');
  titleResult.innerHTML = 'Latest results';
  const headTableResult = document.createElement('div');
  headTableResult.classList.add('headTableResult');
  headTableResult.innerHTML =
    '<div class="line-row head-row"><div class="line-col">level</div><div class="line-col">bombs</div><div class="line-col">steps</div><div class="line-col">time</div></div>';
  lastResultWrapper.appendChild(titleResult);
  lastResultWrapper.appendChild(headTableResult);
  lastResultWrapper.appendChild(resultTable);
  wrapperApp.appendChild(lastResultWrapper);

  const renderResult = () => {
    lastResultWrapper.style.display = 'block';

    resultTable.innerHTML = '';
    if (lastResult.length !== 0) {
      lastResult.forEach((item) => {
        resultTable.innerHTML += `
            <div class='line-row'>
                <div class="line-col">${item.levelResult}</div>
                <div class="line-col">${item.bombsCountResult}</div>
                <div class="line-col">${item.clickResult}</div>
                <div class="line-col">${item.timeResult}</div>
            </line>
            `;
      });
    }
  };
  renderResult();

  if (JSON.parse(localStorage.getItem('lastResult')) == null) {
    lastResult = [];
    lastResultWrapper.style.display = 'none';
  } else {
    lastResult = JSON.parse(localStorage.getItem('lastResult'));
    lastResultWrapper.style.display = 'block';
  }

  bombsCountValue.innerHTML = bombsCount.value;

  bombsCount.addEventListener('input', (e) => {
    bombCount = e.target.value;
    bombsCountValue.innerHTML = e.target.value;
    localStorage.setItem('bombCount', JSON.stringify(bombCount));
  });

  timer.textContent = time;
  let field;

  let t;

  function buildTimer() {
    seconds += 1;
    if (seconds >= 60) {
      seconds = 0;
      minutes += 1;
      if (minutes >= 60) {
        minutes = 0;
        seconds = 0;
      }
    }
    timer.textContent = `${minutes < 10 ? `0${minutes.toString()}` : minutes}:${
      seconds < 10 ? `0${seconds.toString()}` : seconds
    }`;

    localStorage.setItem('minutes', JSON.stringify(minutes));
    localStorage.setItem('seconds', JSON.stringify(seconds));
    localStorage.setItem('time', JSON.stringify(timer.textContent));
  }
  function stopTimer() {
    clearTimeout(t);
    localStorage.setItem('time', JSON.stringify('00:00'));
  }
  function startTimer() {
    clearTimeout(t);
    t = setInterval(buildTimer, 1000);
  }
  function resetTimer() {
    seconds = 0;
    minutes = 0;
    timer.textContent = time;
    localStorage.setItem('minutes', JSON.stringify(minutes));
    localStorage.setItem('seconds', JSON.stringify(seconds));
    localStorage.setItem('time', JSON.stringify(timer.textContent));
  }

  const start = (levelStart, minesCount, startIndex) => {
    let h;
    let w;

    flexTimer.style.display = 'flex';

    switch (levelStart) {
      case 'easy':
        h = 10;
        w = 10;
        break;
      case 'medium':
        h = 15;
        w = 15;
        break;
      case 'hard':
        h = 25;
        w = 25;
        break;
      default:
        h = 10;
        w = 10;
    }

    const cells = [...field.children];

    let closedCount = cellsCount;

    if (!progress) {
      time.textContent = '00:00';
      resetTimer();
      mines = [...Array(cellsCount).keys()]
        .filter((item) => item !== startIndex)
        .sort(() => Math.random() - 0.5)
        .slice(0, minesCount);
      localStorage.setItem('mines', JSON.stringify(mines));
    }

    startTimer();

    countMines.innerHTML = mines.length - arrFrags.length;

    const isValid = (row, colum) =>
      row >= 0 && row < h && colum >= 0 && colum < w;

    const isBoms = (row, colum) => {
      if (!isValid(row, colum)) return false;
      const index = row * w + colum;
      return mines.includes(index);
    };

    const getCount = (row, colum) => {
      let count = 0;
      for (let x = -1; x <= 1; x += 1) {
        for (let y = -1; y <= 1; y += 1) {
          if (isBoms(row + y, colum + x)) {
            count += 1;
          }
        }
      }
      return count;
    };

    function open(row, colum) {
      if (!isValid(row, colum)) return;

      const index = row * w + colum;
      const cell = cells[index];

      if (cell.disabled === true) return;
      if (cell.classList.contains('bombs') === true) return;
      cell.disabled = true;

      if (isBoms(row, colum)) {
        if (sound.classList.contains('soundless') === false) {
          new Audio('audio/mines.mp3').play();
        }

        cells.forEach((item, inx) => {
          if (mines.includes(inx)) {
            item.classList.add('mines');
            cell.classList.add('active');
          }
        });

        cell.classList.add('mines');
        wrapper.style.pointerEvents = 'none';
        stopTimer();
        flexTimer.classList.remove('win');
        flexTimer.classList.add('loss');
        return;
      }

      closedCount -= 1;
      if (closedCount <= minesCount) {
        cells.forEach((item, inx) => {
          if (mines.includes(inx)) {
            item.classList.add('mines');
            cell.classList.add('active');
          }
        });
        if (sound.classList.contains('soundless') === false) {
          new Audio('audio/win.mp3').play();
        }

        if (lastResult.length > 10) {
          lastResult.push({
            levelResult: level,
            timeResult: timer.innerHTML,
            clickResult: clickArr.length,
            bombsCountResult: bombsCount.value,
          });
          lastResult.shift();
        } else {
          lastResult.push({
            levelResult: level,
            timeResult: timer.innerHTML,
            clickResult: clickArr.length,
            bombsCountResult: bombsCount.value,
          });
        }

        stopTimer();
        wrapper.disabled = true;
        progress = false;
        localStorage.setItem('progress', JSON.stringify(progress));
        localStorage.setItem('lastResult', JSON.stringify(lastResult));
        flexTimer.classList.remove('loss');
        flexTimer.classList.add('win');
        renderResult();
      }

      const count = getCount(row, colum);

      cell.classList.remove('bombs');

      if (count !== 0) {
        cell.innerHTML = count;
        switch (count) {
          case 1:
            cell.style.color = 'green';
            break;
          case 2:
            cell.style.color = 'red';
            break;
          case 3:
            cell.style.color = 'blue';
            break;
          case 4:
            cell.style.color = 'purple';
            break;
          case 5:
            cell.style.color = 'orange';
            break;
          default:
            cell.style.color = '#000';
        }
        return;
      }

      for (let x = -1; x <= 1; x += 1) {
        for (let y = -1; y <= 1; y += 1) {
          open(row + y, colum + x);
        }
      }
    }

    const fieldClick = (e) => {
      if (String(e.target.classList) === 'button' && progress) {
        if (sound.classList.contains('soundless') === false) {
          new Audio('audio/click.mp3').play();
        }
        const index = cells.indexOf(e.target);
        const colum = index % w;
        const row = (index - colum) / w;
        if (clickArr.includes(index) == false) {
          clickArr.push(index);
        }

        localStorage.setItem('clickArr', JSON.stringify(clickArr));
        open(row, colum);
        numberSteps.innerHTML = clickArr.length;
      }
    };

    field.addEventListener('click', fieldClick);

    field.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (String(e.target.classList) === 'button') {
        if (sound.classList.contains('soundless') === false) {
          new Audio('audio/bomb.mp3').play();
        }
      }

      if (e.target.classList.contains('button') && e.target.disabled !== true) {
        if (e.target.classList.contains('bombs')) {
          minesCount += 1;
          const index = cells.indexOf(e.target);
          arrFrags = arrFrags.filter((item) => item !== index);
        } else {
          minesCount -= 1;
          const index = cells.indexOf(e.target);
          arrFrags.push(index);
        }

        localStorage.setItem('bombCount', JSON.stringify(minesCount));

        localStorage.setItem('arrFrags', JSON.stringify(arrFrags));

        e.target.classList.toggle('bombs');

        function equalArrays(arrFlag, arrMines) {
          if (arrFlag.length == arrMines.length) {
            arrFlag.sort((a, b) => a - b);
            arrMines.sort((a, b) => a - b);
            if (JSON.stringify(arrFlag) === JSON.stringify(arrMines)) {
              if (sound.classList.contains('soundless') === false) {
                new Audio('audio/win.mp3').play();
              }
              stopTimer();
              lastResult.push({
                levelResult: level,
                timeResult: timer.innerHTML,
                clickResult: clickArr.length,
                bombsCountResult: bombsCount.value,
              });

              localStorage.setItem('lastResult', JSON.stringify(lastResult));
              renderResult();

              wrapper.disabled = true;
              flexTimer.classList.remove('loss');
              flexTimer.classList.add('win');
            }
          } else return;
        }

        equalArrays(arrFrags, mines);
        countMines.innerHTML = minesCount;
      }
    });
  };

  const levellayout = (levelValue) => {
    switch (levelValue) {
      case 'easy':
        cellsCount = 100;
        break;
      case 'medium':
        cellsCount = 225;
        break;
      case 'hard':
        cellsCount = 625;
        break;
      default:
        cellsCount = 100;
    }
    wrapper.innerHTML = '';

    field = document.createElement('div');
    field.classList = 'field';
    wrapper.append(field);
    field.innerHTML = '<button class="button"></button>'.repeat(cellsCount);
    if (arrFrags.length > 0) {
      const cells = [...field.children];
      cells.forEach((btn, index) => {
        if (arrFrags.includes(index)) {
          btn.classList.add('bombs');
        }
      });
    }

    if (progress && clickArr.length > 0) {
      const cells = [...field.children];
      cells.forEach((btn, index) => {
        if (clickArr.includes(index)) {
          start(level, Number(bombsCount.value));
          btn.click();
        }
      });
    }
  };

  levellayout(level);

  settingsGame.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-level')) {
      settingsFlex.style.display = 'flex';
      flexTimer.style.display = 'none';
      time.textContent = '00:00';
      //resetTimer();
      stopTimer();
      time = '00:00';
      wrapper.classList.remove('easy', 'medium', 'hard');
      level = e.target.getAttribute('data-level');
      localStorage.setItem('level', level);
      wrapper.classList.add(level);
      init = 0;
      numSteps = 0;
      localStorage.setItem('init', JSON.stringify(init));
      progress = false;
      localStorage.setItem('progress', JSON.stringify(progress));
      localStorage.setItem('numSteps', JSON.stringify(numSteps));
      arrFrags = [];
      localStorage.setItem('arrFrags', JSON.stringify(arrFrags));
      clickArr = [];
      localStorage.setItem('clickArr', JSON.stringify(clickArr));

      levellayout(level);

      switch (level) {
        case 'easy':
          bombsCount.value = 10;
          bombsCountValue.innerHTML = bombsCount.value;
          countMines.innerHTML = bombsCount.value;
          break;
        case 'medium':
          bombsCount.value = 30;
          bombsCountValue.innerHTML = bombsCount.value;
          countMines.innerHTML = bombsCount.value;
          break;
        case 'hard':
          bombsCount.value = 50;
          bombsCountValue.innerHTML = bombsCount.value;
          countMines.innerHTML = bombsCount.value;
          break;
        default:
          bombsCount.value = 10;
      }

      bombCount = bombsCount.value;

      localStorage.setItem('bombCount', JSON.stringify(bombCount));
    }
  });

  startGame.addEventListener('click', () => {
    init = 0;
    localStorage.setItem('init', JSON.stringify(init));
    time.textContent = '00:00';
    //resetTimer();
    stopTimer();
    time = '00:00';
    numSteps = 0;
    arrFrags = [];
    localStorage.setItem('arrFrags', JSON.stringify(arrFrags));
    clickArr = [];
    localStorage.setItem('clickArr', JSON.stringify(clickArr));
    mines = [];
    localStorage.setItem('mines', JSON.stringify(mines));
    settingsGame.style.display = 'flex';
    settingsFlex.style.display = 'flex';
    flexTimer.style.display = 'none';
    startGame.style.display = 'none';
    wrapper.style.pointerEvents = 'auto';
    flexTimer.classList.remove('win', 'loss');
    progress = false;
    localStorage.setItem('progress', JSON.stringify(progress));
    localStorage.setItem('numSteps', JSON.stringify(numSteps));
    levellayout(level);
  });

  wrapper.addEventListener('click', (e) => {
    if (String(e.target.classList) === 'button' && progress == false) {
      settingsGame.style.display = 'none';
      startGame.style.display = 'block';
      const cells = [...field.children];
      const startIndex = cells.indexOf(e.target);
      start(level, Number(bombsCount.value), startIndex);
      settingsFlex.style.display = 'none';
      progress = true;
      localStorage.setItem('progress', JSON.stringify(progress));
      e.target.click();
    }
  });

  gameTheme.addEventListener('change', () => {
    wrapper.classList.toggle('black');
    themeOn
      ? localStorage.setItem('themeOn', JSON.stringify(false))
      : localStorage.setItem('themeOn', JSON.stringify(true));
  });

  sound.addEventListener('click', (e) => {
    e.target.classList.toggle('soundless');
    soundOn
      ? localStorage.setItem('soundOn', JSON.stringify(false))
      : localStorage.setItem('soundOn', JSON.stringify(true));
  });
};

renderTemplate();
