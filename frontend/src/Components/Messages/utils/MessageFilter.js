// src/components/MessageFilter/MessageFilter.js
import React from 'react';
import PropTypes from 'prop-types';

// Emoji mappings for all levels
const EMOJI_MAP = {
    // Abuse levels
    'abuse.level1': '😠',
    'abuse.level2': '😤',
    'abuse.level3': '😡',
    'abuse.level4': '🤬',

    // Romance levels
    'romance.level1': '🩷',
    'romance.level2': '❤️',
    'romance.level3': '💘',
    'romance.level4': '🔥',
};

// Complete abusive words dictionary
const ABUSIVE_WORDS = {
    'abuse.level1': new Set([
        'shut up', 'you suck', 'stupid', 'loser', 'retard', 'get lost', '5hit', 'anal',
        'b*tch', 'bimbos', 'chuj', 'cohee', 'dumbass', 'dumbasses', 'dumbshit', 'fatso',
        'fcuk', 'fook', 'fooker', 'fvck', 'gaydo', 'gstring', 'gub', 'gyped'
    ]),
    'abuse.level2': new Set([
        'bastard', 'moron', 'jerk', 'asskiss', 'asslover', 'assmaster', 'asspacker',
        'asswipe', 'babeland', 'bosche', 'circlejerk', 'clitorus', 'cockknob', 'cokmuncher',
        'coon asses', 'cunillingus', 'currymuncher', 'cyberfuc', 'd1ck', 'dildos', 'dumbass',
        'dumbbitch', 'dumbfuck', 'f u c k e r', 'fagbag', 'faggot', 'fannybandit',
        'flipping the bird', 'frotting', 'fuck', 'fuckyomama', 'g-spot', 'goddammit',
        'golden shower', 'gonzagas', 'gookeye', 'goyim'
    ]),
    'abuse.level3': new Set([
        'asshole', 'bitch', 'cock', 'cocksucker', 'cumdumpster', 'cunt', 'dickhead',
        'douchebag', 'fag', 'fuckface', 'fuckhead', 'fucktard', 'goddamn', 'motherfucker',
        'numbnuts', 'prick', 'shithead', 'shitface', 'skank', 'slag', 'slutbag', 'titfuck',
        'tosser', 'twats', 'whorebag', 'nigga', 'Nigga'
    ]),
    'abuse.level4': new Set([
        'assnigger', 'christ killer', 'christ killers', 'chonkys', 'chunkys', 'daterape',
        'flydie', 'hairybacks', 'nazi', 'nigga', 'nigger', 'piss off', 'pissed off',
        'pussies', 'raghead', 'ragheads', 'retarded', 'screw you', 'shit', 'slut',
        'son of a bitch', 'twat', 'wanker', 'whore'
    ]),
};

// Complete romantic words dictionary
const ROMANTIC_WORDS = {
    'romance.level1': new Set([
        'cute', 'sweet', 'adorable', 'hug', 'kiss', 'like you', 'miss you',
        'thinking of you', 'cutie', 'sweetie', 'babe', 'baby', 'honey', 'dear',
        'angel', 'cutie pie', 'sugar', 'precious', 'lovely'
    ]),
    'romance.level2': new Set([
        'love you', 'loving you', 'my love', 'beloved', 'darling', 'dearest',
        'heart', 'valentine', 'soulmate', 'amore', 'cherish', 'treasure',
        'affection', 'devoted', 'yearn', 'adore', 'romance', 'sweetheart',
        'better half', 'other half', 'true love', 'my everything'
    ]),
    'romance.level3': new Set([
        'passion', 'desire', 'lust', 'intimate', 'make love', 'longing',
        'crave you', "can't live without you", 'obsessed with you', 'burn for you',
        'need you', 'want you', 'yours forever', 'eternal love', 'consumed by you',
        'madly in love', 'head over heels', 'infatuated', 'enchanted by you',
        'under your spell', 'love of my life'
    ]),
    'romance.level4': new Set([
        'fuck me', 'fucking you', 'harder', 'ride me', 'dirty', 'naughty',
        'sexy time', 'hot', 'horny', 'cum', 'cock', 'pussy', 'dick', 'fuck you',
        'bang me', 'pound me', 'bend over', 'spank me', 'hard for you',
        'wet for you', 'suck me', 'lick me', 'eat me out', 'ride you',
        'fuck hard', 'deep inside', 'come for me', 'make me cum'
    ]),
};

// Helper function to escape regex special characters
const escapeRegExp = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const MessageFilter = ({ children, message, onFilter }) => {
    const filterMessage = (input) => {
        if (!input || typeof input !== 'string') return input;

        let result = input;

        // Process abuse words from most to least severe
        for (const level of [
            'abuse.level4',
            'abuse.level3',
            'abuse.level2',
            'abuse.level1',
        ]) {
            if (!ABUSIVE_WORDS[level]) continue;

            for (const phrase of ABUSIVE_WORDS[level]) {
                const regex = new RegExp(
                    `(^|\\W)${escapeRegExp(phrase)}(s|es)?(\\W|$)`,
                    'gi'
                );
                result = result.replace(
                    regex,
                    (match, p1, p2, p3) =>
                        `${p1}${EMOJI_MAP[level].repeat(Math.min(phrase.length, 5))}${p3}`
                );
            }
        }

        // Process romantic words from most to least intense
        for (const level of [
            'romance.level4',
            'romance.level3',
            'romance.level2',
            'romance.level1',
        ]) {
            if (!ROMANTIC_WORDS[level]) continue;

            for (const phrase of ROMANTIC_WORDS[level]) {
                const regex = new RegExp(
                    `(^|\\W)${escapeRegExp(phrase)}(s|es)?(\\W|$)`,
                    'gi'
                );
                result = result.replace(
                    regex,
                    (match, p1, p2, p3) =>
                        `${p1}${EMOJI_MAP[level].repeat(Math.min(phrase.length, 3))}${p3}`
                );
            }
        }

        return result;
    };

    // If children is a function, call it with filtered message
    if (typeof children === 'function') {
        return children(filterMessage(message));
    }

    // If onFilter prop is provided, call it with filtered message
    if (onFilter) {
        onFilter(filterMessage(message));
        return null;
    }

    // Default render (filter text content)
    return <>{filterMessage(message)}</>;
};

MessageFilter.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
    ]),
    message: PropTypes.string,
    onFilter: PropTypes.func
};

export default MessageFilter;