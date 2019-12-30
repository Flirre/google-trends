import { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import * as admin from 'firebase-admin';
import * as googleTrends from 'google-trends-api';

// Firebase setup
import * as firebaseConfig from '../db/firebaseConfig.json';
import * as serviceAccount from '../db/serviceAccount.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: firebaseConfig.url
});

const db = admin.firestore();
const matchRef = db.collection('matches').doc('test-match');
const increment = admin.firestore.FieldValue.increment;

export class DB {
  public async startGame(): Promise<void> {
    await this.resetGameState();
    await this.fetchTerms();
  }

  public async fetchTerms(): Promise<string[]> {
    try {
      const documentData = await this.getTermDocumentData();
      const fetchedTerms = documentData!.terms;
      this.setTerms(fetchedTerms);
      return fetchedTerms;
    } catch (error) {
      console.error(error);
      return ['ERROR'];
    }
  }

  public async getPoints(): Promise<{ team1: number; team2: number }> {
    try {
      const documentData = await this.getDocumentData();
      return { team1: documentData!.team1, team2: documentData!.team2 };
    } catch (error) {
      console.log(error);
      return { team1: 0, team2: 0 };
    }
  }

  public addTrendTerm(
    searchTerm: string,
    team: string
  ): Promise<FirebaseFirestore.WriteResult> {
    const key = `${team}Term`;
    return matchRef.update({ [key]: searchTerm });
  }

  public async getTrendData(): Promise<any> {
    await this.incrementRound();
    let team1Data: any = [];
    let team2Data: any = [];
    let trendData = {};
    const trendTerm = await this.getTrendTerm();
    const documentData = await this.getDocumentData();
    const { team1, team2 } = await this.getSearchTerms();

    try {
      const trend = await googleTrends.interestOverTime({
        keyword: [`${trendTerm} ${team1}`, `${trendTerm} ${team2}`]
      });
      const JSONTrend = JSON.parse(trend);
      const formattedTrend = JSONTrend.default.timelineData.slice(-12);
      this.pushTrendData(formattedTrend, team1Data, team1, 0);
      this.pushTrendData(formattedTrend, team2Data, team2, 1);

      if (
        this.dataWasFetched(team1Data, team2Data) &&
        (await this.noPlayersReady())
      ) {
        const mostRecentData = formattedTrend[formattedTrend.length - 1];
        const pointsTeam1 = mostRecentData.value[0];
        const pointsTeam2 = mostRecentData.value[1];
        // 	  if(documentData) TODO FIX PLS
        await this.setPoints(pointsTeam1, pointsTeam2);
      }

      if (this.noDataWasFetched(team1Data, team2Data)) {
        team1Data = this.generateDummyData(team1);
        team2Data = this.generateDummyData(team2);
      }

      trendData = { team1: team1Data, team2: team2Data };
      return trendData;
    } catch (error) {
      console.log(error);
      trendData = {};
      team1Data = this.generateDummyData(team1);
      team2Data = this.generateDummyData(team2);
      trendData = { team1: team1Data, team2: team2Data };
      return trendData;
    }
  }

  public async setNextTrendTerm(): Promise<FirebaseFirestore.WriteResult> {
    const currentTerm = await this.popTrendTermFromList();
    if (!currentTerm) {
      await this.fetchTerms();
      return this.setNextTrendTerm();
    }
    return matchRef.update({
      currentTerm
    });
  }

  public async getTrendTerm(): Promise<string> {
    const documentData = await this.getDocumentData();
    const currentTerm = documentData!.currentTerm;
    return currentTerm;
  }

  public async gameOver(): Promise<boolean> {
    const documentData = await this.getDocumentData();
    const round = documentData!.round;
    const maxRounds = documentData!.maxRounds;
    return round >= maxRounds;
  }

  public async incrementReady(): Promise<FirebaseFirestore.WriteResult> {
    return matchRef.update({
      ready: admin.firestore.FieldValue.increment(1)
    });
  }

  public resetReady(): Promise<FirebaseFirestore.WriteResult> {
    return matchRef.update({ ready: 0 });
  }

  public async bothPlayersReady(): Promise<boolean> {
    const documentData = await this.getDocumentData();
    const readyPlayers = documentData!.ready;
    return readyPlayers === 2;
  }

  public async noPlayersReady(): Promise<boolean> {
    const documentData = await this.getDocumentData();
    const readyPlayers = documentData!.ready;
    return readyPlayers === 0;
  }

  public async getReadyPlayers(): Promise<number> {
    const documentData = await this.getDocumentData();
    const readyPlayers = documentData!.ready;
    return readyPlayers;
  }

  public resetGameState(): Promise<FirebaseFirestore.WriteResult> {
    return matchRef.update({
      currentTerm: 'yeet',
      maxRounds: 3,
      ready: 0,
      round: 0,
      team1: 0,
      team1Name: 'left',
      team1Term: '',
      team2: 0,
      team2Name: 'right',
      team2Term: '',
      termhistory: [],
      terms: [],
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  private setTerms(terms: string[]): Promise<FirebaseFirestore.WriteResult> {
    return matchRef.update({ terms });
  }

  private async getTermDocument(): Promise<FirebaseFirestore.DocumentSnapshot> {
    try {
      const document = await db
        .collection('terms')
        .doc('testTerms')
        .get();
      return document;
    } catch (error) {
      throw Error(error);
    }
  }

  private async getTermDocumentData(): Promise<FirebaseFirestore.DocumentData> {
    try {
      const document = await this.getTermDocument();
      const documentData = await document.data()!;
      return documentData;
    } catch (error) {
      throw Error(error);
    }
  }

  private async getSearchTerms(): Promise<{ team1: string; team2: string }> {
    const documentData = await this.getDocumentData();
    const { team1Term, team2Term } = documentData;
    return { team1: team1Term, team2: team2Term };
  }

  private pushTrendData(
    trendData: any,
    teamData: any,
    term: string,
    team: number
  ) {
    trendData.forEach((data: any) => {
      teamData.push({
        date: data.formattedTime,
        points: data.value[team],
        term
      });
    });
  }

  private dataWasFetched(term1: [], term2: []) {
    return !this.noDataWasFetched(term1, term2);
  }

  private noDataWasFetched(term1: [], term2: []): boolean {
    return this.isArrayEmpty(term1) && this.isArrayEmpty(term2);
  }

  private isArrayEmpty(array: []): boolean {
    return array.length <= 0;
  }

  private generateDummyData(term: string): any[] {
    const termData = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      date.setMonth(date.getMonth() + i);
      const month = date.toString().substring(4, 7);
      const year = date.getFullYear();
      termData.push({
        date: `${month} ${year}`,
        points: 0,
        term
      });
    }
    return termData;
  }

  private async setPoints(
    team1Points: number,
    team2Points: number
  ): Promise<FirebaseFirestore.WriteResult> {
    return matchRef.update({
      team1: increment(team1Points),
      team2: increment(team2Points)
    });
  }

  private incrementRound(): Promise<FirebaseFirestore.WriteResult> {
    return matchRef.update({
      round: admin.firestore.FieldValue.increment(1)
    });
  }

  private async popTrendTermFromList(): Promise<string> {
    const documentData = await this.getDocumentData();
    const terms = documentData!.terms;
    const nextTerm = terms.pop();
    await matchRef.update({ terms });
    return nextTerm;
  }

  private async getDocumentData(): Promise<FirebaseFirestore.DocumentData> {
    try {
      const document = await matchRef.get();
      const documentData = await document.data()!;
      return documentData;
    } catch (error) {
      throw Error(error);
    }
  }

  private async calcWinner(): Promise<string> {
    const { team1, team2 } = await this.getPoints();
    const { team1Name, team2Name } = await this.getDocumentData();
    if (team1 > team2) {
      return team1Name;
    }
    if (team2 > team1) {
      return team2Name;
    } else {
      return 'DRAW';
    }
  }
}
